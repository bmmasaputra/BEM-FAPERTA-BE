import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;

export default {
  async publishArticle(body, file, admin) {
    const id = nanoid();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("article-thumbnail/" + id, file, { contentType: "image/jpg" });

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

    console.log(1);

    return { status: 201, data: newArticle };
  },
};
