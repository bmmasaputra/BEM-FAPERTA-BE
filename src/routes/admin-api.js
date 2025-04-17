import express from "express";
import upload from "../../lib/multer/uploadFile.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";
import articleController from "../controller/articleController.js";
import albumController from "../controller/albumController.js";
import pengurusController from "../controller/pengurusController.js";
import divisionController from "../controller/divisionController.js";
import kabinetController from "../controller/kabinetController.js";

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
adminRouter.post("/api/v1/album", albumController.add);
adminRouter.put("/api/v1/album", albumController.edit);
adminRouter.delete("/api/v1/album", albumController.remove);
adminRouter.post(
  "/api/v1/album/photo",
  upload.single("image"),
  albumController.addPhoto
);
adminRouter.delete("/api/v1/album/image", albumController.removeImage);

// PENGURUS API
adminRouter.post(
  "/api/v1/pengurus",
  upload.single("image"),
  pengurusController.add
);
adminRouter.put(
  "/api/v1/pengurus",
  upload.single("image"),
  pengurusController.edit
);
adminRouter.delete("/api/v1/pengurus", pengurusController.remove);
adminRouter.post("/api/v1/pengurus/contact", pengurusController.addContact);
adminRouter.delete(
  "/api/v1/pengurus/contact",
  pengurusController.removeContact
);

// DIVISION API
adminRouter.post("/api/v1/division", divisionController.add);
adminRouter.put("/api/v1/division", divisionController.edit);
adminRouter.delete("/api/v1/division", divisionController.remove);
adminRouter.post("/api/v1/division/pengurus", divisionController.addPengurus);
adminRouter.put("/api/v1/division/pengurus", divisionController.editPengurus);
adminRouter.delete(
  "/api/v1/division/pengurus",
  divisionController.removePengurus
);

// KABINET API
adminRouter.post(
  "/api/v1/pengurus",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  kabinetController.add
);
adminRouter.put(
  "/api/v1/pengurus",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  kabinetController.put
);
adminRouter.delete("/api/v1/pengurus", kabinetController.remove);

export default adminRouter;
