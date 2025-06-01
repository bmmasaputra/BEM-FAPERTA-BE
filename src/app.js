import express from "express";
import cors from "cors";
import publicRouter from "./routes/public-api.js";
import adminRouter from "./routes/admin-api.js";

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin); // Reflect the origin
    },
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
