const express = require("express");
const { createProxyServer } = require("http-proxy");
const http = require("http");

const app = express();
const proxy = createProxyServer({
  changeOrigin: true,
  ws: true, // WebSocket support
});

// Default target (can be Discord or WhatsApp)
const DEFAULT_TARGET = "https://example.com/";

// Proxy HTTP requests
app.use((req, res) => {
  const target = req.query.target || DEFAULT_TARGET;
  proxy.web(req, res, { target }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });
});

// Create server with WebSocket upgrade support
const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  const target = DEFAULT_TARGET;
  proxy.ws(req, socket, head, { target });
});

// Use Cyclic’s PORT or 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
