import express from "express";
import adminController from "../controller/adminController.js";
import articleController from "../controller/articleController.js";
import albumController from "../controller/albumController.js";
import pengurusController from "../controller/pengurusController.js";
import divisionController from "../controller/divisionController.js";
import kabinetController from "../controller/kabinetController.js";

const publicRouter = express.Router();

// ADMIN AUTH
publicRouter.post("/api/v1/admin/init", adminController.initiate);
publicRouter.post("/api/v1/admin/login", adminController.login);

// ARTICLE API
publicRouter.get("/api/v1/article", articleController.getAll);
publicRouter.get("/api/v1/article/:id", articleController.getById);

// ALBUM API
publicRouter.get("/api/v1/album", albumController.getAll);
publicRouter.get("/api/v1/album/:id", albumController.getById);

// PENGURUS API
publicRouter.get("/api/v1/pengurus", pengurusController.getAll);
publicRouter.get("/api/v1/pengurus/:id", pengurusController.getById);

// DIVISION API
publicRouter.get("/api/v1/division", divisionController.getAll);
publicRouter.get("/api/v1/division/:id", divisionController.geById);

// KABINET API
publicRouter.get("/api/v1/kabinet", kabinetController.getAll);
publicRouter.get("/api/v1/kabinet/:id", kabinetController.getById);

export default publicRouter;
