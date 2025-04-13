import Joi from "joi";
import pengurusService from "../service/pengurusService.js";

const addPengurusSchema = Joi.object({
  nim: Joi.string().max(255).required(),
  fullname: Joi.string().max(255).required(),
  jurusan: Joi.string().max(255).required(),
});

const editPengurusSchema = Joi.object({
  id: Joi.string().required(),
  nim: Joi.string().max(255).required(),
  fullname: Joi.string().max(255).required(),
  jurusan: Joi.string().max(255).required(),
});

const addContactSchema = Joi.object({
  pengurus_id: Joi.string().required(),
  link: Joi.string().max(255).required(),
  contact_type: Joi.string().required(),
});

const idSchema = Joi.string().required();

export default {
  async add(req, res) {
    const { valErr } = addPengurusSchema.validate(req.body);

    if (valErr) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;
      const file = req.file;

      const process = await pengurusService.addPengurus(body, file.buffer);

      if (process.status !== 201) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Pengurus Added",
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
    const { valErr } = editPengurusSchema.validate(req.body);

    if (valErr) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;
      const file = req.file;

      const process = await pengurusService.editPengurus(body, file.buffer);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Pengurus Updated",
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
    const { valErr } = idSchema.validate(req.body.id);

    if (valErr) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;

      const process = await pengurusService.removePengurus(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Pengurus Removed",
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

  async addContact(req, res) {
    const { valErr } = addContactSchema.validate(req.body);

    if (valErr) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { pengurus_id, link, contact_type } = req.body;

      const process = await pengurusService.addContact(
        pengurus_id,
        link,
        contact_type
      );

      if (process.status !== 201) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Contact Added",
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

  async removeContact(req, res) {
    const { valErr } = idSchema.validate(req.body.id);

    if (valErr) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;

      const process = await pengurusService.removeContact(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Contact Removed",
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
      const process = await pengurusService.getAllPengurus();

      res.status(200).json({
        success: true,
        message: "Pengurus Retrieved",
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
    const { valErr } = idSchema.validate(req.params.id);

    if (valErr) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.params.id;

      const process = await pengurusService.getPengurusById(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Pengurus Retrieved",
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
