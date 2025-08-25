const http = require("http");
const httpProxy = require("http-proxy");

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true, // enable WebSocket proxying
});

// Target (example: Discord)
const TARGET = "https://discord.com"; 

// Create HTTP server
const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: TARGET }, (err) => {
    console.error("Proxy error:", err);
    res.writeHead(500);
    res.end("Proxy error");
  });
});

// Handle WebSocket connections
server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head, { target: TARGET });
});

server.listen(3000, () => {
  console.log("Proxy running on http://localhost:3000");
});

