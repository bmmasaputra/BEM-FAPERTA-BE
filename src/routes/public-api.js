import express from "express";
import adminController from "../controller/adminController.js";

const publicRouter = express.Router();

// ADMIN ACTIVITY
publicRouter.post("/api/v1/admin/init", adminController.initiate);
publicRouter.post("/api/v1/admin/login", adminController.login);

export default publicRouter