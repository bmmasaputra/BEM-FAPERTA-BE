import Joi from "joi";
import divisionService from "../service/divisionService.js";

const addDivisionSchema = Joi.object({
  type: Joi.string().valid("Biro", "Dinas").required(),
  name_short: Joi.string().max(255).required(),
  fullname: Joi.string().max(255).required(),
  description: Joi.string().required(),
});

const editDivisionSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid("Biro", "Dinas").required(),
  name_short: Joi.string().max(255).required(),
  fullname: Joi.string().max(255).required(),
  description: Joi.string().required(),
});

const addPengurusSchema = Joi.object({
  pengurus_id: Joi.string().max(255).required(),
  division_id: Joi.string().max(255).required(),
  departemen: Joi.string().max(255).required(),
  bidang: Joi.string().max(255).required(),
});

const editPengurusSchema = Joi.object({
  id: Joi.string().required(),
  departemen: Joi.string().max(255).required(),
  bidang: Joi.string().max(255).required(),
});

const idSchema = Joi.string().required();

export default {
  async add(req, res) {
    const { error } = addDivisionSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { type, name_short, fullname, description } = req.body;

      const process = await divisionService.addDivision(
        type,
        name_short,
        fullname,
        description
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
        message: "Division Added",
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
    const { error } = editDivisionSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { id, type, name_short, fullname, description } = req.body;

      const process = await divisionService.editDivison(
        id,
        type,
        name_short,
        fullname,
        description
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
        message: "Division Updated",
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

      const process = await divisionService.removeDivison(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Division Removed",
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

  async addPengurus(req, res) {
    const { error } = addPengurusSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { pengurus_id, division_id, departemen, bidang } = req.body;

      const process = await divisionService.addPengurusDivision(
        pengurus_id,
        division_id,
        departemen,
        bidang
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
        message: "Pengurus Added to Division",
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

  async editPengurus(req, res) {
    const { error } = editPengurusSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { id, departemen, bidang } = req.body;

      const process = await divisionService.editPengurusDivision(
        id,
        departemen,
        bidang
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
        message: "Pengurus Edited",
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

  async removePengurus(req, res) {
    const { error } = idSchema.validate(req.body.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.body.id;

      const process = await divisionService.removePengurusDivision(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Pengurus Removed From Division",
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
      const process = divisionService.getAllDivision();

      res.status(200).json({
        success: true,
        message: "Division Retrieved",
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

  async geById(req, res) {
    const { error } = idSchema.validate(req.params.id);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const id = req.params.id;

      const process = await divisionService.getDivisionById(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Division Retrieved",
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
