import { createServer } from "node:http";

const PORT = process.env.PORT || 5002;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001/api";

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function proxyToBackend(req, res, pathname) {
  try {
    const body = await parseJsonBody(req);
    const response = await fetch(`${BACKEND_URL}${pathname}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    });

    const responseText = await response.text();
    let payload = {};

    if (responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = { message: responseText };
      }
    }

    sendJson(res, response.status, payload);
  } catch (error) {
    sendJson(res, 502, {
      success: false,
      message: error.message || "Unable to reach backend",
    });
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    res.end();
    return;
  }

  if (
    req.method === "POST" &&
    (url.pathname === "/api/feedback.php" ||
      url.pathname === "/api/complaint.php" ||
      url.pathname === "/api/login.php")
  ) {
    await proxyToBackend(req, res, url.pathname);
    return;
  }

  if (
    req.method === "GET" &&
    (url.pathname === "/api/feedback.php" ||
      url.pathname === "/api/complaints" ||
      url.pathname === "/api/health")
  ) {
    await proxyToBackend(req, res, url.pathname);
    return;
  }

  sendJson(res, 404, { success: false, message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Backend proxy listening on http://localhost:${PORT}`);
});
