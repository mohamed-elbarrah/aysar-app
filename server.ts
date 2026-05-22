import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import next from "next";
import cookieParser from "cookie-parser";
import { apiRouter } from "./app/api";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const nextApp = next({ dev, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(express.json());

  server.use("/api", apiRouter);

  server.all("/{*splat}", (req, res) => handle(req, res));

  server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[server error]", err.message);
    res.status(500).json({ success: false, error: "حدث خطأ في الخادم" });
  });

  server.listen(port, () => {
    console.log(`> Server running on http://localhost:${port}`);
  });
});
