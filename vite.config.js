import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    // three.js and React Three Fiber share one chunk (about 250 kB gzipped) that only the home page hero loads
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vite's preload helper must not land in the three chunk, or every page would preload it
          if (id.includes("preload-helper") || id.includes("commonjsHelpers")) return "react";
          // Package names are matched exactly so R3F's own react-* dependencies stay with three
          if (/node_modules\/(three|@react-three|react-reconciler|its-fine|zustand|suspend-react|react-use-measure)\//.test(id)) return "three";
          if (/node_modules\/(react|react-dom|scheduler|react-router)\//.test(id)) return "react";
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: false,
  },
});
