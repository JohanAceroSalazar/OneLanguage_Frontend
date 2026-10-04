import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const root = path.resolve(".");
    const env = loadEnv(mode, root, "");
    const certificatePath = env.VITE_DEV_HTTPS_CERT;
    const keyPath = env.VITE_DEV_HTTPS_KEY;
    const https = certificatePath && keyPath
        ? {
            cert: fs.readFileSync(path.resolve(certificatePath)),
            key: fs.readFileSync(path.resolve(keyPath)),
        }
        : undefined;

    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 5173,
            strictPort: true,
            https,
            proxy: {
                "/api": { target: "http://127.0.0.1:8084", changeOrigin: true },
                "/auth": { target: "http://127.0.0.1:8084", changeOrigin: true },
                "/ws/recognize": { target: "ws://127.0.0.1:8001", changeOrigin: true, ws: true },
            },
        },
    };
});
