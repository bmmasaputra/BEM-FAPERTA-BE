import Joi from "joi";
import profileService from "../service/profileService.js";

// Schema untuk validasi input
const statsSchema = Joi.object({
  total_mahasiswa: Joi.number().required(),
  total_pengurus: Joi.number().required(),
  jumlah_poker: Joi.number().required(),
  sambutan_gub: Joi.string().required(),
  sambutan_wagub: Joi.string().required(),
});

const sambutanSchema = Joi.object({
  sambutan_gub: Joi.string().required(),
  sambutan_wagub: Joi.string().required(),
});

const statsOnlySchema = Joi.object({
  total_mahasiswa: Joi.number().required(),
  total_pengurus: Joi.number().required(),
  jumlah_proker: Joi.number().required(),
});

const activeKabinetSchema = Joi.object({
  kabinet_aktif_id: Joi.string().required(),
});

export default {
  async init(req, res) {
    const { error } = statsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    try {
      const hero = req.files["hero"][0];
      const gub = req.files["gub"][0];
      const wagub = req.files["wagub"][0];
      const body = req.body;

      const process = await profileService.init(body, hero, gub, wagub);

      res.status(process.status).json({
        success: true,
        message: "Profile initialized",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async setActiveKabinet(req, res) {
    const { error } = activeKabinetSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    try {
      const { kabinet_aktif_id } = req.body;
      const process = await profileService.setActiveKabinet(kabinet_aktif_id);

      res.status(process.status).json({
        success: true,
        message: "Active kabinet updated",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async updateStats(req, res) {
    const { error } = statsOnlySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    try {
      const { total_mahasiswa, total_pengurus, jumlah_proker } = req.body;
      const process = await profileService.updateStats(
        total_mahasiswa,
        total_pengurus,
        jumlah_proker
      );

      res.status(process.status).json({
        success: true,
        message: "Profile stats updated",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async updateHero(req, res) {
    try {
      const hero = req.files["hero"][0];
      const process = await profileService.updateHero(hero);

      res.status(process.status).json({
        success: true,
        message: "Hero image updated",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async updateGub(req, res) {
    try {
      const gub = req.files["gub"][0];
      const process = await profileService.updateGub(gub);

      res.status(process.status).json({
        success: true,
        message: "Gubernur image updated",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async updateWagub(req, res) {
    try {
      const wagub = req.files["wagub"][0];
      const process = await profileService.updateWagub(wagub);

      res.status(process.status).json({
        success: true,
        message: "Wakil Gubernur image updated",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async updateSambutan(req, res) {
    const { error } = sambutanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    try {
      const { sambutan_gub, sambutan_wagub } = req.body;
      const process = await profileService.updateSambutan(
        sambutan_gub,
        sambutan_wagub
      );

      res.status(process.status).json({
        success: true,
        message: "Sambutan updated",
        data: process.profile,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },

  async getProfile(req, res) {
    try {
      const process = await profileService.getProfile();

      res.status(process.status).json({
        success: true,
        message: "Profile retrieved",
        data: process.data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }
  },
};
