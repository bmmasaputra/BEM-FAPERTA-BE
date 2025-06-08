import express from "express";
import upload from "../../lib/multer/uploadFile.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";
import articleController from "../controller/articleController.js";
import albumController from "../controller/albumController.js";
import pengurusController from "../controller/pengurusController.js";
import divisionController from "../controller/divisionController.js";
import kabinetController from "../controller/kabinetController.js";
import profileController from "../controller/profileController.js";
import ukmController from "../controller/ukmController.js";
import aspirationController from "../controller/aspirationController.js";

const adminRouter = express.Router();
adminRouter.use(authMiddleware);

// ADMIN AUTH
adminRouter.get("/api/v1/admin", adminController.getAll);
adminRouter.post("/api/v1/admin/assign", adminController.assign);
adminRouter.delete("/api/v1/admin", adminController.remove);

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
  "/api/v1/kabinet",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  kabinetController.add
);
adminRouter.put(
  "/api/v1/kabinet",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  kabinetController.edit
);
adminRouter.delete("/api/v1/kabinet", kabinetController.remove);

// PROFILE API
adminRouter.post(
  "/api/v1/profile/init",
  upload.fields([
    { name: "hero", maxCount: 1 },
    { name: "gub", maxCount: 1 },
    { name: "wagub", maxCount: 1 },
  ]),
  profileController.init
);
adminRouter.put("/api/v1/profile/active", profileController.setActiveKabinet);
adminRouter.put("/api/v1/profile/stats", profileController.updateStats);
adminRouter.put(
  "/api/v1/profile/hero",
  upload.fields([{ name: "hero", maxCount: 1 }]),
  profileController.updateHero
);
adminRouter.put(
  "/api/v1/profile/gub",
  upload.fields([{ name: "gub", maxCount: 1 }]),
  profileController.updateGub
);
adminRouter.put(
  "/api/v1/profile/wagub",
  upload.fields([{ name: "wagub", maxCount: 1 }]),
  profileController.updateWagub
);
adminRouter.put("/api/v1/profile/sambutan", profileController.updateSambutan);

// UKM API
adminRouter.post("/api/v1/ukm", upload.single("logo"), ukmController.add);
adminRouter.put("/api/v1/ukm", ukmController.edit);
adminRouter.put(
  "/api/v1/ukm/logo",
  upload.single("logo"),
  ukmController.editLogo
);
adminRouter.delete("/api/v1/ukm", ukmController.remove);

// ASPIRATION API
adminRouter.get("/api/v1/aspiration", aspirationController.getAll);
adminRouter.get("/api/v1/aspiration/:id", aspirationController.getById);
adminRouter.delete("/api/v1/aspiration", aspirationController.remove);

export default adminRouter;
