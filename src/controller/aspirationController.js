import Joi from "joi";
import aspirationService from "../service/aspirationService.js";

const submitAspirationSchema = Joi.object({
  email: Joi.string().email().required(),
  firstname: Joi.string().max(255).required(),
  lastname: Joi.string().max(255).required(),
  subject: Joi.string().max(255).required(),
  content: Joi.string().required(),
});

const idSchema = Joi.string().required();

export default {
  async submit(req, res) {
    const { error } = submitAspirationSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    try {
      const { email, firstname, lastname, subject, content } = req.body;

      const result = await aspirationService.submitAspriation(
        email,
        firstname,
        lastname,
        subject,
        content
      );

      res.status(result.status).json({
        success: true,
        message: "Aspiration Submitted",
        data: result.data,
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
      const result = await aspirationService.removeAspiration(req.body.id);

      res.status(result.status).json({
        success: true,
        message: "Aspiration Removed",
        data: result.data,
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
      const result = await aspirationService.getAllAspiration();

      res.status(result.status).json({
        success: true,
        message: "All Aspirations Retrieved",
        data: result.data,
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
      const result = await aspirationService.getAspirationById(req.params.id);

      if (result.status !== 200) {
        return res.status(result.status).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Aspiration Retrieved",
        data: result.data,
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
