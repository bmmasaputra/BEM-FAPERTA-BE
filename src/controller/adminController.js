import Joi from "joi";
import adminService from "../service/adminService.js";

const adminSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(1).required(),
});

export default {
  async initiate(req, res) {
    // return res.status(403).json({
    //   success: false,
    //   message: "Access Forbiden"
    // })
    const { error } = adminSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { username, password } = req.body;
      const process = await adminService.addAdmin(username, password);

      if (process.status !== 201) {
        res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Admin created",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async assign(req, res) {
    const admin = req.admin;

    const { error } = adminSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { username, password } = req.body;
      const process = await adminService.addAdmin(username, password);

      if (process.status !== 201) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Admin created",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async login(req, res) {
    const { error } = adminSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { username, password } = req.body;
      const process = await adminService.adminLogin(username, password);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        token: process.token,
        admin: process.admin.username,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getAll(req, res) {
    const admin = req.admin;

    try {
      const process = await adminService.getAllAdmin();

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        data: process.allAdmin,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
