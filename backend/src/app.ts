import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Main API Routes
app.use("/api", apiRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
