// The home page hero: a black bumper plate stamped "1 ST", lit by yellow strips like the
// LED lines in the gym, rolling in once and then turning slowly toward the pointer.
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
    strip("#38d6ee", 1.8, [9, 0.25], [0, -4, 2]);

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

// Where the hero's plate placeholder sits inside the canvas, as fractions of the canvas size
function useStageLayout(stage) {
  const gl = useThree((s) => s.gl);
  const layout = useRef(null);
  const measure = () => {
    const c = gl.domElement.getBoundingClientRect();
    const s = stage.current?.getBoundingClientRect();
    if (!s || !c.width || !c.height) return;
    layout.current = {
      x: (s.left + s.width / 2 - c.left) / c.width,
      y: (s.top + s.height / 2 - c.top) / c.height,
      size: s.height / c.height,
    };
  };
  return { layout, measure };
}

function Plate({ stage, motion, side, onReady }) {
  const tilt = useRef(null);
  const spin = useRef(null);
  const face = useFaceTexture();
  const rubber = useMemo(() => new THREE.LatheGeometry(rounded(RUBBER, 0.03), 180), []);
  const steel = useMemo(() => new THREE.LatheGeometry(rounded(STEEL, 0.015), 120), []);
  useEffect(() => () => [rubber, steel].forEach((g) => g.dispose()), [rubber, steel]);

  const pointer = useRef({ x: 0, y: 0 });
  const intro = useRef(motion ? 0 : 1);
  const idle = useRef(0);
  const reported = useRef(false);
  const frames = useRef(0);
  const { layout, measure } = useStageLayout(stage);

  useEffect(() => {
    if (!motion) return;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [motion]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Re-measure now and then: fonts, language and window size all move the placeholder
    if (frames.current++ % 15 === 0 || !layout.current) measure();
    if (!layout.current) return;
    const { width: vw, height: vh } = state.viewport;
    const scale = (layout.current.size * 0.86 * vh) / (2 * RADIUS);
    const homeX = (layout.current.x - 0.5) * vw;
    const homeY = (0.5 - layout.current.y) * vh;

    if (motion) {
      intro.current = Math.min(1, intro.current + dt / 1.7);
      idle.current += dt;
    } else {
      intro.current = 1;
    }
    const eased = 1 - Math.pow(1 - intro.current, 3);
    // Rolls in from the edge of the screen: the distance travelled turns the plate like a wheel
    const startX = side * (vw / 2 + RADIUS * scale * 1.1);
    const x = startX + (homeX - startX) * eased;
    // Comes to rest with "1 ST" level, then rocks gently so the print stays readable
    const sway = Math.sin(idle.current * 0.45) * 0.14 * eased * side;
    spin.current.rotation.y = sway - (x - homeX) / (RADIUS * scale);

    const scroll = motion ? Math.min(1, window.scrollY / window.innerHeight) : 0;
    const turnY = -0.5 * side + (motion ? pointer.current.x * 0.3 : 0);
    const turnX = -0.08 - (motion ? pointer.current.y * 0.18 : 0) - scroll * 0.5;
    const g = tilt.current;
    if (motion) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, turnY, 4, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, turnX, 4, dt);
    } else {
      g.rotation.set(turnX, turnY, 0);
    }
    g.position.set(x, homeY + scroll * vh * 0.25, 0);
    g.scale.setScalar(scale);

    if (!reported.current) {
      reported.current = true;
      onReady?.();
    }
  });

  return (
    <group ref={tilt}>
      {/* Stand the plate up: its axle runs toward the camera */}
      <group rotation-x={Math.PI / 2}>
        <group ref={spin}>
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
    </group>
  );
}

function dotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// Chalk dust drifting up through the light
function Dust({ motion, light, count = 240 }) {
  const points = useRef(null);
  const sprite = useMemo(dotTexture, []);
  useEffect(() => () => sprite.dispose(), [sprite]);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.05 + Math.random() * 0.14;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (!motion) return;
    const dt = Math.min(delta, 0.05);
    const attr = points.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      attr.array[i * 3 + 1] += speeds[i] * dt;
      attr.array[i * 3] += Math.sin(time * 0.4 + i) * 0.0009;
      if (attr.array[i * 3 + 1] > 3) attr.array[i * 3 + 1] = -3;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={0.05}
        sizeAttenuation
        transparent
        depthWrite={false}
        color={light ? "#7a5900" : "#ffe7a3"}
        opacity={light ? 0.45 : 0.7}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function PlateScene({ stage, motion, active, dir, theme, onReady }) {
  // In right-to-left pages the plate sits on the left, so it rolls in and turns the other way
  const side = dir === "rtl" ? -1 : 1;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.7], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={motion && active ? "always" : "demand"}
    >
      <StudioLights side={side} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} />
      <Plate key={side} stage={stage} motion={motion} side={side} onReady={onReady} />
      <Dust motion={motion} light={theme === "light"} />
    </Canvas>
  );
}
