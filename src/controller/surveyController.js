import Joi from "joi";
import surveyService from "../service/surveyService.js";

export default {
  async createSurvey(req, res) {
    try {
      const { name, desc, form_link, result_link } = req.body;

      const process = await surveyService.addSurvey(
        name,
        desc,
        form_link,
        result_link
      );

      res.status(201).json({
        success: true,
        message: "Survey created",
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

  async editSurvey(req, res) {
    try {
      const { id, name, desc, form_link, result_link } = req.body;

      const process = await surveyService.editSurvey(
        id,
        name,
        desc,
        form_link,
        result_link
      );

      res.status(200).json({
        success: true,
        message: "Survey updated",
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

  async removeSurvey(req, res) {
    try {
      const id = req.body.id;

      const process = await surveyService.removeSurvey(id);

      res.status(200).json({
        success: true,
        message: "Survey removed",
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

  async getAllSurvey(req, res ) {
    try {
        const process = await surveyService.getAllSurvey();

        res.status(200).json({
          success: true,
          message: "Survey retrieved",
          data: process.data,
        });
    } catch {
        res.status(500).json({
          success: false,
          message: error.message,
          error,
        });
    }
  }
};
