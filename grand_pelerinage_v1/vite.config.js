import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const { processMail } = require("./api/mailCore.cjs");

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

function adminSpaEntryPlugin() {
  return {
    name: "admin-spa-entry",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexFile = path.join(distDir, "index.html");
      if (!fs.existsSync(indexFile)) return;
      const html = fs.readFileSync(indexFile, "utf8");
      fs.writeFileSync(path.join(distDir, "admin.html"), html, "utf8");
      const adminDir = path.join(distDir, "admin");
      fs.mkdirSync(adminDir, { recursive: true });
      fs.writeFileSync(path.join(adminDir, "index.html"), html, "utf8");
    }
  };
}

export default defineConfig({
  plugins: [react(), mailApiPlugin(), adminSpaEntryPlugin()],
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
