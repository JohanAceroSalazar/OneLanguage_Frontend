import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import WebSocket, { WebSocketServer } from "ws";
import https from "node:https";
import { resolveAiSocketUrl } from "../src/config/aiSocketUrl.js";

const origin = "https://localhost:5173";
const socketUrl = resolveAiSocketUrl("", new URL(origin));
const vite = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      VITE_API_URL: "",
      VITE_AI_WS_URL: "",
      VITE_DEV_HTTPS_CERT: "./certs/onelanguage-cert.pem",
      VITE_DEV_HTTPS_KEY: "./certs/onelanguage-key.pem",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let viteOutput = "";
vite.stdout.on("data", (chunk) => { viteOutput = `${viteOutput}${chunk}`.slice(-4000); });
vite.stderr.on("data", (chunk) => { viteOutput = `${viteOutput}${chunk}`.slice(-4000); });

const upstream = new WebSocketServer({ host: "127.0.0.1", port: 8000 });
let receivedOrigin;
upstream.on("connection", (socket, request) => {
  receivedOrigin = request.headers.origin;
  socket.on("message", (payload, isBinary) => {
    if (isBinary) return;
    const message = JSON.parse(payload.toString());
    if (message.type === "auth" && message.token === "smoke-test-token") {
      socket.send(JSON.stringify({ type: "ready" }));
    }
  });
});

const waitForVite = async () => {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (vite.exitCode !== null) throw new Error(`Vite exited early:\n${viteOutput}`);
    try {
      await new Promise((resolve, reject) => {
        const request = https.get(origin, { rejectUnauthorized: false }, (response) => {
          response.resume();
          response.statusCode === 200 ? resolve() : reject(new Error(`Vite returned ${response.statusCode}`));
        });
        request.setTimeout(2000, () => request.destroy(new Error("Vite request timed out")));
        request.on("error", reject);
      });
      return;
    } catch {
      await delay(250);
    }
  }
  throw new Error(`Vite did not become ready:\n${viteOutput}`);
};

let client;
try {
  await new Promise((resolve, reject) => {
    upstream.once("listening", resolve);
    upstream.once("error", reject);
  });
  await waitForVite();

  client = new WebSocket(socketUrl, {
    origin,
    rejectUnauthorized: false,
    handshakeTimeout: 5000,
  });
  await new Promise((resolve, reject) => {
    client.once("open", resolve);
    client.once("error", reject);
  });
  client.send(JSON.stringify({ type: "auth", token: "smoke-test-token" }));

  const [payload] = await Promise.race([
    new Promise((resolve, reject) => {
      client.once("message", (...args) => resolve(args));
      client.once("error", reject);
    }),
    delay(5000).then(() => { throw new Error("Timed out waiting for the proxied WebSocket response"); }),
  ]);

  assert.equal(receivedOrigin, origin, "Vite must forward the browser Origin to the AI WebSocket");
  assert.deepEqual(JSON.parse(payload.toString()), { type: "ready" });
  console.log("AI WebSocket proxy smoke test passed (HTTPS localhost:5173 -> ws://127.0.0.1:8000).");
} finally {
  client?.close();
  await new Promise((resolve) => upstream.close(resolve));
  vite.kill();
}
