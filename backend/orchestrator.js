import express from "express";
import cors from "cors";
import helmet from "helmet";
import gateway from "./api/gateway.js";
import { env } from "./infrastructure/environment.js";

const engine = express();

engine.use(helmet());
engine.use(cors());
engine.use(express.json({ limit: "15mb" }));

// Resolve Domain
engine.use("/api/v1", gateway);

// Monitoring
engine.get("/status", (req, res) => res.json({ uptime: process.uptime(), state: "online" }));

const PORT = env.PORT || 5002;
engine.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 Decide Engine online at port ${PORT}`);
});

export default engine;
