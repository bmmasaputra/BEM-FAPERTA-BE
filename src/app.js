import express from "express";
import cors from "cors";
import publicRouter from "./routes/public-api.js";
import adminRouter from "./routes/admin-api.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://bemfapertaunand.vercel.app",
  "https://adminbemfapertaunand.vercel.app",
  "http://192.168.18.24:5173"
];

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store"); // prevent stale headers
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

// Optional: Handle preflight explicitly for safety
app.options("*", cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API active",
  });
});

app.use(publicRouter);
app.use(adminRouter);

export default app;
