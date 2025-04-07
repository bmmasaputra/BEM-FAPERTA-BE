import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async publishArticle(body, file, admin) {
    const id = nanoid();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("article-thumbnail/" + id + extension, file, {
        contentType: "image/jpg",
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const { title, content } = body;
    const created_at = new Date().toISOString();
    const thumbnail_url = FILE_URL + data.fullPath;

    const newArticle = await prisma.artikel.create({
      data: {
        id,
        title,
        thumbnail_url,
        content,
        created_at,
        publisher_id: admin.id,
      },
    });

    return { status: 201, data: newArticle };
  },

  async editArticle(body, file, admin) {
    const { id, title, content } = body;
    const edited_at = new Date().toISOString();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("article-thumbnail/" + id + extension, file, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const edit = await prisma.artikel.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        edited_at,
        editor_id: admin.id,
      },
    });

    return { status: 200, data: edit };
  },

  async removeArticle(id) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(["article-thumbnail/" + id + extension]);

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const remove = await prisma.artikel.delete({
      where: { id },
    });

    return { status: 200, data: remove };
  },

  async getAllArticle() {
    const article = await prisma.artikel.findMany();

    return { status: 200, data: article };
  },

  async getArticleById(id) {
    const article = await prisma.artikel.findFirst({
      where: { id },
      include: {
        admin_artikel_publisher_idToadmin: {
          select: {
            username: true,
          },
        },
        admin_artikel_editor_idToadmin: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!article) {
      return { status: 404, message: "Article Not Found" };
    }

    return { status: 200, data: article };
  },
};
