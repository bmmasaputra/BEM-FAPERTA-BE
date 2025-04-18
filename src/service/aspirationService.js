import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async submitAspriation(email, firstname, lastname, subject, content) {
    const id = nanoid();
    const created_at = new Date().toISOString();

    const aspiration = await prisma.aspiration_box_response.create({
      data: {
        id,
        email,
        firstname,
        lastname,
        subject,
        content,
        created_at,
      },
    });

    return { status: 201, data: aspiration };
  },

  async removeAspiration(id) {
    const aspiration = await prisma.aspiration_box_response.delete({
      where: { id },
    });
    return { status: 200, data: aspiration };
  },

  async getAllAspiration() {
    const aspiration = await prisma.aspiration_box_response.findMany();
    return { status: 200, data: aspiration };
  },

  async getAspirationById(id) {
    const aspiration = await prisma.aspiration_box_response.findFirst({
      where: { id },
    });

    if (!aspiration) {
        return {status: 404, message: "Aspiration Not Found"}
    }

    return { status: 200, data: aspiration };
  },
};
