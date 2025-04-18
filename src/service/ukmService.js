import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async addUkm(name, description, url_link, logo) {
    const id = nanoid();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("ukm-logo/" + id + extension, logo, {
        contentType: "image/jpg",
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const logoUrl = FILE_URL + data.fullPath;

    const ukm = await prisma.ukm.create({
      data: {
        id,
        name,
        description,
        url_link,
        logoUrl,
      },
    });

    return { status: 201, data: ukm };
  },

  async editUkmData(id, name, description, url_link) {
    const findUkm = await prisma.ukm.findFirst({
      where: { id },
    });

    if (!findUkm) {
      return { staus: 404, message: "UKM Not Found" };
    }

    const ukm = await prisma.ukm.update({
      where: { id },
      data: {
        name,
        description,
        url_link,
      },
    });

    return { status: 200, data: ukm };
  },

  async editUkmLogo(id, logo) {
    const findUkm = await prisma.ukm.findFirst({
      where: { id },
    });

    if (!findUkm) {
      return { staus: 404, message: "UKM Not Found" };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("ukm-logo/" + id + extension, logo, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    return { status: 200, data };
  },

  async removeUkm(id) {
    const findUkm = await prisma.ukm.findFirst({
      where: { id },
    });

    if (!findUkm) {
      return { staus: 404, message: "UKM Not Found" };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(["ukm-logo/" + id + extension]);

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const ukm = await prisma.ukm.delete({
      where: { id },
    });

    return { status: 200, data: ukm };
  },

  async getAllUkm() {
    const ukm = await prisma.ukm.findMany();
    return { status: 200, data: ukm };
  },
};
