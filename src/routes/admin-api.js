import express from "express";
import upload from "../../lib/multer/uploadFile.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";
import articleController from "../controller/articleController.js";
import albumController from "../controller/albumController.js";

const adminRouter = express.Router();
adminRouter.use(authMiddleware);

// ADMIN AUTH
adminRouter.get("/api/v1/admin", adminController.getAll);
adminRouter.post("/api/v1/admin/assign", adminController.assign);

// ARTICLE API
adminRouter.post(
  "/api/v1/article/post",
  upload.single("thumbnail"),
  articleController.publish
);
adminRouter.put(
  "/api/v1/article/edit",
  upload.single("thumbnail"),
  articleController.edit
);
adminRouter.delete("/api/v1/article/remove", articleController.remove);

// AlBUM API
adminRouter.post("/api/v1/album/post", albumController.add);
adminRouter.put("/api/v1/album/edit", albumController.edit);
adminRouter.delete("/api/v1/album/remove", albumController.remove);

export default adminRouter;
