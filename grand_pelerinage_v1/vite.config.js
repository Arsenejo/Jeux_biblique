import { createRequire } from "node:module";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const { processMail } = require("../api/mailCore.cjs");

function mailApiPlugin() {
  return {
    name: "mail-api",
    configureServer(server) {
      server.middlewares.use("/api/send-email", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ success: false, error: "Méthode refusée." }));
          return;
        }
        const env = loadEnv(server.config.mode, server.config.envDir, "");
        let raw = "";
        req.on("data", (chunk) => {
          raw += chunk;
        });
        req.on("end", async () => {
          let body = {};
          try {
            body = JSON.parse(raw || "{}");
          } catch {
            body = {};
          }
          const result = await processMail(body, env, req.socket?.remoteAddress || "local");
          res.statusCode = result.status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(result.body));
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), mailApiPlugin()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: false
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          icons: ["lucide-react"]
        }
      }
    }
  }
});
