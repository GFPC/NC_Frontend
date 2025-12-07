import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Proxy all /api requests to FastAPI backend (port 8000)
  app.use("/api", async (req, res) => {
    try {
      const fastApiUrl = `http://localhost:8000${req.path}`;
      
      let body = undefined;
      if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
          // Convert back to URLSearchParams for FastAPI
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(req.body)) {
            params.append(key, String(value));
          }
          body = params.toString();
        } else {
          body = JSON.stringify(req.body);
        }
      }

      const response = await fetch(fastApiUrl, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
        },
        body,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Backend service unavailable. Make sure FastAPI is running on port 8000." 
      });
    }
  });

  return httpServer;
}
