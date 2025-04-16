import Joi from "joi";
import articleService from "../service/articleService.js";

const publishArticleScheme = Joi.object({
  title: Joi.string().max(255).required(),
  content: Joi.string().required(),
});

const editArticleScheme = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().max(255).required(),
  content: Joi.string().required(),
});

const deleteArticleScheme = Joi.object({
  id: Joi.string().required(),
});

const idSchema = Joi.string().required();

export default {
  async publish(req, res) {
    const admin = req.admin;

    const { error } = publishArticleScheme.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;
      const file = req.file;

      const process = await articleService.publishArticle(
        body,
        file.buffer,
        admin
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
        message: "Article Published",
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

    const { error } = editArticleScheme.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const body = req.body;
      const file = req.file;

      const process = await articleService.editArticle(
        body,
        file.buffer,
        admin
      );

      res.status(200).json({
        success: true,
        message: "Article Edited",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async remove(req, res) {
    const admin = req.admin;

    const { error } = deleteArticleScheme.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { id } = req.body;

      const process = await articleService.removeArticle(id);

      res.status(200).json({
        success: true,
        message: "Article Removed",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const process = await articleService.getAllArticle();

      res.status(200).json({
        success: true,
        message: "Article Retrieved",
        data: process.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
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

      const process = await articleService.getArticleById(id);

      if (process.status !== 200) {
        return res.status(process.status).json({
          success: false,
          error: process.error,
          message: process.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Article Retrieved",
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
