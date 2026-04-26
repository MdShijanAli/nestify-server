import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { envVars } from "./config/env";
import { AuthRoutes } from "./modules/auth/auth.route";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: (envVars.CLIENT_URL || "http://localhost:3000").trim(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", AuthRoutes);
// app.use("/api/users", UserRoutes);

app.use("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blog Management API");
});

// app.use(errorHandler);
// app.use(notFoundHandler);
export const PORT = envVars.PORT;

export default app;
