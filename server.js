import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5001;
const DATA_DIR = join(__dirname, "data");
const FEEDBACK_FILE = join(DATA_DIR, "feedback.json");
const COMPLAINTS_FILE = join(DATA_DIR, "complaints.json");

function ensureFile(filePath) {
  if (!existsSync(filePath)) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, "[]", "utf8");
  }
}

function readJson(filePath) {
  ensureFile(filePath);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  ensureFile(filePath);
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

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
      } catch (error) {
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

  if (req.method === "POST" && url.pathname === "/api/feedback.php") {
    try {
      const body = await parseJsonBody(req);
      const feedbacks = readJson(FEEDBACK_FILE);
      const record = {
        id: Date.now(),
        customerName: body.customerName || body.name || "",
        rating: body.rating || "",
        comments: body.comments || "",
        createdAt: new Date().toISOString(),
      };

      feedbacks.push(record);
      writeJson(FEEDBACK_FILE, feedbacks);

      sendJson(res, 200, {
        success: true,
        message: "Feedback saved",
        data: record,
      });
    } catch (error) {
      sendJson(res, 400, { success: false, message: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/complaints") {
    try {
      const body = await parseJsonBody(req);
      const complaints = readJson(COMPLAINTS_FILE);
      const record = {
        id: Date.now(),
        customerName: body.customerName || body.name || "",
        subject: body.subject || "",
        message: body.message || "",
        createdAt: new Date().toISOString(),
      };

      complaints.push(record);
      writeJson(COMPLAINTS_FILE, complaints);

      sendJson(res, 200, {
        success: true,
        message: "Complaint saved",
        data: record,
      });
    } catch (error) {
      sendJson(res, 400, { success: false, message: error.message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/login") {
    sendJson(res, 200, { token: "demo-token" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/feedback.php") {
    sendJson(res, 200, readJson(FEEDBACK_FILE));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/complaints") {
    sendJson(res, 200, readJson(COMPLAINTS_FILE));
    return;
  }

  sendJson(res, 404, { success: false, message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
