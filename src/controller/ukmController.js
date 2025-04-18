import Joi from "joi";
import ukmService from "../service/ukmService.js";

const addUkmSchema = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
  url_link: Joi.string().uri().required(),
});

const editUkmSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
  url_link: Joi.string().uri().required(),
});

const idSchema = Joi.string().required();

export default {
  async add(req, res) {
    const { error } = addUkmSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { name, description, url_link } = req.body;
      const file = req.file;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "Logo image is required" });
      }

      const process = await ukmService.addUkm(
        name,
        description,
        url_link,
        file.buffer
      );

      res.status(process.status).json({
        success: true,
        message: "UKM Added",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, error });
    }
  },

  async edit(req, res) {
    const { error } = editUkmSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { id, name, description, url_link } = req.body;
      const process = await ukmService.editUkmData(
        id,
        name,
        description,
        url_link
      );

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "UKM Updated",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, error });
    }
  },

  async editLogo(req, res) {
    const { error } = idSchema.validate(req.body.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;
      const file = req.file;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "Logo image is required" });
      }

      const process = await ukmService.editUkmLogo(id, file.buffer);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "UKM Logo Updated",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, error });
    }
  },

  async remove(req, res) {
    const { error } = idSchema.validate(req.body.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;
      const process = await ukmService.removeUkm(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "UKM Removed",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, error });
    }
  },

  async getAll(req, res) {
    try {
      const process = await ukmService.getAllUkm();

      res.status(200).json({
        success: true,
        message: "UKM Retrieved",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message, error });
    }
  },
};
