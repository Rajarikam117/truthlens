const http = require("http");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");
const env = fs.existsSync(envPath)
  ? Object.fromEntries(
      fs.readFileSync(envPath, "utf8")
        .split(/\r?\n/)
        .filter((line) => line && !line.trim().startsWith("#"))
        .map((line) => {
          const separator = line.indexOf("=");
          return separator === -1
            ? [line.trim(), ""]
            : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
        })
    )
  : {};

const port = 3001;

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function proxy(request, response, target, headers) {
  try {
    let body = await readBody(request);
    if (headers["x-api-key"]) {
      const payload = JSON.parse(body || "{}");
      payload.api_key = headers["x-api-key"];
      body = JSON.stringify(payload);
      delete headers["x-api-key"];
    }
    const upstream = await fetch(target, {
      method: request.method,
      headers: { "Content-Type": "application/json", ...headers },
      body: request.method === "GET" ? undefined : body
    });
    const result = await upstream.text();
    response.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/json"
    });
    response.end(result);
  } catch (error) {
    response.writeHead(502, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: { message: `Proxy request failed: ${error.message}` } }));
  }
}

const server = http.createServer((request, response) => {
  if (request.method !== "POST") {
    response.writeHead(405, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: { message: "Only POST requests are supported" } }));
    return;
  }

  if (request.url === "/api/tavily/search") {
    proxy(request, response, "https://api.tavily.com/search", {
      "x-api-key": env.REACT_APP_TAVILY_API_KEY
    });
    return;
  }

  if (request.url === "/api/groq/openai/v1/chat/completions") {
    proxy(request, response, "https://api.groq.com/openai/v1/chat/completions", {
      Authorization: `Bearer ${env.REACT_APP_GROQ_API_KEY}`
    });
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: { message: "Unknown API route" } }));
});

server.listen(port, () => {
  console.log(`TruthLens API proxy listening on http://localhost:${port}`);
});
