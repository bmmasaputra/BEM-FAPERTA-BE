import { nanoid } from "nanoid";
import prisma from "../../prisma/prismaClient.js";

export default {
  async addSurvey(name, desc, form_link, result_link) {
    const id = nanoid();
    const created_at = new Date().toISOString();

    const survey = await prisma.survey.create({
      data: {
        id,
        name,
        desc,
        form_link,
        result_link,
        created_at,
      },
    });

    return { status: 201, data: survey };
  },

  async editSurvey(id, name, desc, form_link, result_link) {
    const survey = await prisma.survey.update({
      where: { id },
      data: {
        name,
        desc,
        form_link,
        result_link,
      },
    });
    return { status: 200, data: survey };
  },

  async removeSurvey(id) {
    const survey = await prisma.survey.delete({
      where: { id },
    });
    return { status: 200, data: survey };
  },

  async getAllSurvey() {
    const survey = await prisma.survey.findMany();
    return { status: 200, data: survey };
  },
};
