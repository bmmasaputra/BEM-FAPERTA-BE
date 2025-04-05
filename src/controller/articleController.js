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

export default {
  async publish(req, res) {
    const admin = req.admin;

    const { valErr } = publishArticleScheme.validate(req.body);

    if (valErr) {
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
        res.status(process.status).json({
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
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },

  async edit(req, res) {
    const admin = req.admin;

    const { valErr } = editArticleScheme.validate(req.body);

    
  },
};
