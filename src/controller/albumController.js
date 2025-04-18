import Joi from "joi";
import albumService from "../service/albumService.js";

const addAlbumSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  desc: Joi.string().required(),
});

const editAlbumSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().min(3).max(255).required(),
  desc: Joi.string().required(),
});

const addPhotoSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  desc: Joi.string().required(),
});

const idSchema = Joi.string().required();

export default {
  async add(req, res) {
    const admin = req.admin;

    const { error } = addAlbumSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;

      const process = await albumService.addAlbum(body, admin);

      if (process.status !== 201) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Album created",
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
    const admin = req.admin;

    const { error } = editAlbumSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;

      const process = await albumService.editAlbum(body, admin);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Album updated",
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
    const admin = req.admin;

    const { error } = idSchema.validate(req.body.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;

      const process = await albumService.removeAlbum(id, admin);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Album deleted",
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
      const process = await albumService.getAllAlbum();

      res.status(200).json({
        success: true,
        message: "Album retrieved",
        data: process,
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

      const process = await albumService.getAlbumById(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Album retrieved",
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

  async addPhoto(req, res) {
    const admin = req.admin;

    const { error } = addPhotoSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;
      const file = req.file;

      const process = await albumService.addPhotoToAlbum(body, file.buffer);

      res.status(201).json({
        success: true,
        message: "Image added to gallery",
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

  async removeImage(req, res) {
    const { error } = idSchema.validate(req.body.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;

      const process = await albumService.removeImageFromAlbum(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Image deleted",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
