import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";

const adminRouter = express.Router();
adminRouter.use(authMiddleware);

// ADMIN AUTH
adminRouter.get("/api/v1/admin", adminController.getAll);
adminRouter.post("/api/v1/admin/assign", adminController.assign);

export default adminRouter;