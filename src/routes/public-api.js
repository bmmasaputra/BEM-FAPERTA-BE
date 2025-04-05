import express from "express";
import adminController from "../controller/adminController.js";
import articleController from "../controller/articleController.js";

const publicRouter = express.Router();

// ADMIN ACTIVITY
publicRouter.post("/api/v1/admin/init", adminController.initiate);
publicRouter.post("/api/v1/admin/login", adminController.login);

export default publicRouter;
