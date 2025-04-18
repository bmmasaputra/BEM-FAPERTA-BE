import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async addKabinet(body, logo, image) {
    const { name, visi, misi, gubernur_id, wakil_id } = body;
    const id = nanoid();

    const { data: dataLogo, error: errorLogo } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("kabinet/logo/" + id + ".jpg", logo, {
        contentType: "image/jpg",
      });

    if (errorLogo) {
      throw new Error("Supabase Error: " + errorLogo.message);
    }

    const { data: dataImage, error: errorImage } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("kabinet/image/" + id + ".jpg", image, {
        contentType: "image/jpg",
      });

    if (errorImage) {
      throw new Error("Supabase Error: " + errorImage.message);
    }

    const logo_url = FILE_URL + dataLogo.fullPath;
    const kabinet_img_url = FILE_URL + dataImage.fullPath;

    const kabinet = await prisma.kabinet.create({
      data: {
        id,
        name,
        logo_url,
        kabinet_img_url,
        visi,
        misi,
        gubernur_id,
        wakil_id,
      },
    });

    return { status: 201, data: kabinet };
  },

  async editKabinet(body, logo, image) {
    const { id, name, visi, misi, gubernur_id, wakil_id } = body;

    const findKabinet = await prisma.kabinet.findFirst({ where: { id } });

    if (!findKabinet) {
      return { status: 404, message: "Kabinet Not Found" };
    }

    const { data: dataLogo, error: errorLogo } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("kabinet/logo/" + id + ".jpg", logo, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (errorLogo) {
      throw new Error("Supabase Error: " + errorLogo.message);
    }

    const { data: dataImage, error: errorImage } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("kabinet/image/" + id + ".jpg", image, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (errorImage) {
      throw new Error("Supabase Error: " + errorImage.message);
    }

    const kabinet = await prisma.kabinet.update({
      where: { id },
      data: {
        name,
        visi,
        misi,
        gubernur_id,
        wakil_id,
      },
    });

    return { status: 200, data: kabinet };
  },

  async removeKabinet(id) {
    const findKabinet = await prisma.kabinet.findFirst({ where: { id } });

    if (!findKabinet) {
      return { status: 404, message: "Kabinet Not Found" };
    }

    const { data: dataLogo, error: errorLogo } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(["kabinet/logo/" + id + ".jpg"]);

    if (errorLogo) {
      throw new Error("Supabase Error: " + error.message);
    }

    const { data: dataImage, error: errorImage } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(["kabinet/image/" + id + ".jpg"]);

    if (errorImage) {
      throw new Error("Supabase Error: " + error.message);
    }

    const kabinet = await prisma.kabinet.delete({
      where: { id },
    });

    return { status: 200, data: kabinet };
  },

  async getAllKabinet() {
    const kabinet = await prisma.kabinet.findMany({
      include: {
        pengurus_kabinet_gubernur_idTopengurus: true,
        pengurus_kabinet_wakil_idTopengurus: true,
      },
    });

    return { status: 200, data: kabinet };
  },

  async getKabinetById(id) {
    const kabinet = await prisma.kabinet.findMany({
      where: { id },
      include: {
        pengurus_kabinet_gubernur_idTopengurus: true,
        pengurus_kabinet_wakil_idTopengurus: true,
      },
    });

    if (!kabinet) {
      return { status: 404, message: "Kabinet Not Found" };
    }

    return { status: 200, data: kabinet };
  },
};
