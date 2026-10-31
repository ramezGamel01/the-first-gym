// The gym's plate in 3D for the hero's glass card: a black bumper plate stamped "1 ST", lit by
// yellow strips like the LED lines in the gym, swaying slowly and leaning toward the pointer.
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const YELLOW = "#ffc414";
const RADIUS = 1.6;
// PlateMark.jsx draws the plate 200 units wide (radius 99.5); the face decal reuses its layout
const SVG_UNIT = RADIUS / 99.5;
const DECAL_INNER = 0.665;
const DECAL_OUTER = 1.35;

// Cross-sections (radius, height) of the rubber and the steel insert, counter-clockwise so the
// lathe's faces point outwards. Each starts mid-face so the seam sits on a flat stretch.
const RUBBER = [
  [1.0, -0.115], [1.36, -0.115], [1.44, -0.17], [1.6, -0.17], [1.6, 0.17], [1.44, 0.17], [1.36, 0.115],
  [0.66, 0.115], [0.6, 0.15], [0.42, 0.15], [0.42, -0.15], [0.6, -0.15], [0.66, -0.115], [1.0, -0.115],
];
const STEEL = [[0.31, -0.18], [0.42, -0.18], [0.42, 0.18], [0.2, 0.18], [0.2, -0.18], [0.31, -0.18]];

// Rounds every inner corner with a short curve, so the lathe's smooth normals look like moulded edges
function rounded(corners, radius, steps = 5) {
  const v = (c) => new THREE.Vector2(c[0], c[1]);
  const points = [v(corners[0])];
  for (let i = 1; i < corners.length - 1; i++) {
    const p = v(corners[i]);
    const a = v(corners[i - 1]);
    const b = v(corners[i + 1]);
    const start = p.clone().add(a.clone().sub(p).setLength(Math.min(radius, a.distanceTo(p) / 2)));
    const end = p.clone().add(b.clone().sub(p).setLength(Math.min(radius, b.distanceTo(p) / 2)));
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      points.push(
        new THREE.Vector2(u * u * start.x + 2 * u * t * p.x + t * t * end.x, u * u * start.y + 2 * u * t * p.y + t * t * end.y)
      );
    }
  }
  points.push(v(corners[corners.length - 1]));
  return points;
}

// Letters along a circle: clockwise over the top, or left to right along the bottom
function arcText(ctx, text, radius, top, spacing) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  let offset = -(widths.reduce((sum, w) => sum + w, 0) + spacing * (chars.length - 1)) / 2;
  chars.forEach((c, i) => {
    const angle = (offset + widths[i] / 2) / radius;
    ctx.save();
    ctx.rotate(top ? angle : -angle);
    ctx.fillText(c, 0, top ? -radius : radius);
    ctx.restore();
    offset += widths[i] + spacing;
  });
}

function drawFace(ctx, size) {
  const font = (px) => `800 ${px}px "Big Shoulders Display Variable", "Arial Narrow", sans-serif`;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  // Work in PlateMark's units: the canvas spans the decal's outer radius
  const scale = size / 2 / (DECAL_OUTER / SVG_UNIT);
  ctx.scale(scale, scale);
  ctx.fillStyle = YELLOW;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = font(14);
  arcText(ctx, "THE FIRST GYM", 70, true, 2.2);
  ctx.font = font(9.5);
  arcText(ctx, "YOUR FIRST PLACE TO BE A HERO", 76, false, 1.1);
  ctx.textBaseline = "middle";
  ctx.font = font(46);
  ctx.fillText("1", -52, 3);
  ctx.font = font(26);
  ctx.fillText("ST", 53, 2);
  ctx.restore();
}

function useFaceTexture() {
  const invalidate = useThree((s) => s.invalidate);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 2048;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);

  useEffect(() => {
    let live = true;
    const draw = () => {
      if (!live) return;
      drawFace(texture.image.getContext("2d"), texture.image.width);
      texture.needsUpdate = true;
      invalidate();
    };
    draw();
    // Redraw once the display font has arrived
    document.fonts?.load('800 100px "Big Shoulders Display Variable"').then(draw, () => {});
    return () => {
      live = false;
      texture.dispose();
    };
  }, [texture, invalidate]);

  return texture;
}

// An environment made of light strips, so the glossy rubber and the steel reflect "the gym".
// `side` mirrors it for right-to-left pages, where the plate turns the other way.
function StudioLights({ side }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const env = new THREE.Scene();
    const plane = new THREE.PlaneGeometry(1, 1);
    const materials = [];
    const strip = (color, intensity, [w, h], position) => {
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(plane, material);
      mesh.scale.set(w, h, 1);
      mesh.position.set(position[0] * side, position[1], position[2]);
      mesh.lookAt(0, 0, 0);
      env.add(mesh);
      materials.push(material);
    };
    strip(YELLOW, 6, [16, 0.35], [0, 5, 0.5]);
    strip(YELLOW, 4, [0.3, 12], [-6, 0, 1.5]);
    strip(YELLOW, 4, [0.3, 12], [6, 0.5, -1.5]);
    // In front of the plate, where its turned face looks: a soft box and one yellow strip for a streak
    strip("#ffffff", 1.3, [6, 3], [-4.5, 1.5, 5]);
    strip(YELLOW, 5, [0.25, 10], [-2.6, 0, 6.5]);
    strip("#ffffff", 2.4, [5, 3], [3, 2.5, 6]);
    strip("#ff8a2a", 2, [9, 0.25], [0, -4, 2]);

    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(env, 0.035);
    scene.environment = target.texture;
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      plane.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [gl, scene, side]);
  return null;
}

function Plate({ motion, side, onReady }) {
  const tilt = useRef(null);
  const face = useFaceTexture();
  const rubber = useMemo(() => new THREE.LatheGeometry(rounded(RUBBER, 0.03), 180), []);
  const steel = useMemo(() => new THREE.LatheGeometry(rounded(STEEL, 0.015), 120), []);
  useEffect(() => () => [rubber, steel].forEach((g) => g.dispose()), [rubber, steel]);

  const pointer = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const reported = useRef(false);

  useEffect(() => {
    if (!motion) return;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motion]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (motion) time.current += dt;
    // Turned toward the headline, swaying like a plate hanging on a peg
    const turnY = side * (-0.38 + Math.sin(time.current * 0.55) * 0.32) + (motion ? pointer.current.x * 0.22 : 0);
    const turnX = -0.1 - (motion ? pointer.current.y * 0.14 : 0);
    const g = tilt.current;
    if (motion) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, turnY, 3, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, turnX, 3, dt);
    } else {
      g.rotation.set(turnX, turnY, 0);
    }
    if (!reported.current) {
      reported.current = true;
      onReady?.();
    }
  });

  return (
    <group ref={tilt}>
      {/* Stand the plate up: its axle runs toward the camera */}
      <group rotation-x={Math.PI / 2}>
        <mesh geometry={rubber}>
          <meshPhysicalMaterial color="#0e0e0e" roughness={0.36} metalness={0.3} clearcoat={1} clearcoatRoughness={0.16} />
        </mesh>
        <mesh geometry={steel}>
          <meshStandardMaterial color="#d9d9d9" metalness={1} roughness={0.2} />
        </mesh>
        {/* Printed face and the yellow band on the rim */}
        <mesh position-y={0.1162} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[DECAL_INNER, DECAL_OUTER, 160]} />
          <meshStandardMaterial
            map={face}
            emissiveMap={face}
            emissive={YELLOW}
            emissiveIntensity={0.4}
            transparent
            depthWrite={false}
            roughness={0.45}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
        <mesh position-y={0.1712} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[1.48, 1.535, 160]} />
          <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.55} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export default function PlateScene({ motion, active, dir, onReady }) {
  // In right-to-left pages the card sits on the other side, so the plate turns the other way
  const side = dir === "rtl" ? -1 : 1;
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.3], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={motion && active ? "always" : "demand"}
    >
      <StudioLights side={side} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} />
      <Plate key={side} motion={motion} side={side} onReady={onReady} />
    </Canvas>
  );
}
