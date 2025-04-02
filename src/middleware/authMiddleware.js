import prisma from "../../prisma/prismaClient.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await prisma.admin.findFirst({ where: { id: decoded.id } });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authMiddleware;
