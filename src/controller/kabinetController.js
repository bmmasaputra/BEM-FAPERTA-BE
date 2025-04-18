import Joi from "joi";
import kabinetService from "../service/kabinetService.js";

const addKabinetSchema = Joi.object({
  name: Joi.string().max(255).required(),
  visi: Joi.string().required(),
  misi: Joi.string().required(),
  gubernur_id: Joi.string().max(255).required(),
  wakil_id: Joi.string().max(255).required(),
});

const editKabinetSchema = Joi.object({
  id: Joi.string().max(255).required(),
  name: Joi.string().required(),
  visi: Joi.string().required(),
  misi: Joi.string().required(),
  gubernur_id: Joi.string().max(255).required(),
  wakil_id: Joi.string().max(255).required(),
});

const idSchema = Joi.string().max(255).required();

export default {
  async add(req, res) {
    const { error } = addKabinetSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const logo = req.files["logo"][0];
      const image = req.files["image"][0];
      const body = req.body;

      const process = await kabinetService.addKabinet(body, logo.buffer, image.buffer);

      if (process.status !== 201) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Kabinet Added",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },

  async edit(req, res) {
    const { error } = editKabinetSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const logo = req.files["logo"][0];
      const image = req.files["image"][0];
      const body = req.body;

      const process = await kabinetService.editKabinet(body, logo.buffer, image.buffer);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Kabinet Updated",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
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

      const process = await kabinetService.removeKabinet(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Kabinet Removed",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },

  async getAll(req, res) {
    try {
      const process = await kabinetService.getAllKabinet();

      res.status(200).json({
        success: true,
        message: "Kabinet Retrieved",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },

  async getById(req, res) {
    const { error } = idSchema.validate(req.params.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.params.id;

      const process = await kabinetService.getKabinetById(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Kabinet Retrieved",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
};
