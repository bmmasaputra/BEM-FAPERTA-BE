import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async init(body, hero, gub, wagub) {
    const {
      total_mahasiswa,
      total_pengurus,
      jumlah_proker,
      sambutan_gub,
      sambutan_wagub,
    } = body;
    const id = "1";

    const { data: data1, error: error1 } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("profile/hero/" + id + extension, hero, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error1) {
      throw new Error("Supabase Error: " + error1.message);
    }

    const { data: data2, error: error2 } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("profile/gub/" + id + extension, gub, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error2) {
      throw new Error("Supabase Error: " + error2.message);
    }

    const { data: data3, error: error3 } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("profile/wagub/" + id + extension, wagub, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error3) {
      throw new Error("Supabase Error: " + error3.message);
    }

    const hero_img_url = FILE_URL + data1.fullPath;
    const gub_img_url = FILE_URL + data2.fullPath;
    const wagub_img_url = FILE_URL + data3.fullPath;

    const profile = await prisma.profile_data.create({
      data: {
        id,
        total_mahasiswa: +total_mahasiswa,
        total_pengurus: +total_pengurus,
        jumlah_proker: +jumlah_proker,
        hero_img_url,
        gub_img_url,
        wagub_img_url,
        sambutan_gub,
        sambutan_wagub,
        kabinet_aktif_id: null,
      },
    });

    return { status: 201, data: profile };
  },

  async setActiveKabinet(kabinet_aktif_id) {
    const profile = await prisma.profile_data.update({
      where: {
        id: "1",
      },
      data: {
        kabinet_aktif_id,
      },
    });

    return { status: 200, data: profile };
  },

  async updateStats(total_mahasiswa, total_pengurus, jumlah_proker) {
    const profile = await prisma.profile_data.update({
      where: {
        id: "1",
      },
      data: {
        total_mahasiswa: +total_mahasiswa,
        total_pengurus: +total_pengurus,
        jumlah_proker: +jumlah_proker,
      },
    });

    return { status: 200, data: profile };
  },

  async updateHero(hero) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("profile/hero/" + "1" + extension, hero, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    return { status: 200, data };
  },

  async updateGub(gub) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("profile/gub/" + "1" + extension, gub, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    return { status: 200, data };
  },

  async updateWagub(wagub) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("profile/wagub/" + "1" + extension, wagub, {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    return { status: 200, data };
  },

  async updateSambutan(sambutan_gub, sambutan_wagub) {
    const profile = await prisma.profile_data.update({
      where: { id: "1" },
      data: {
        sambutan_gub,
        sambutan_wagub,
      },
    });

    return { status: 200, profile };
  },

  async getProfile() {
    const profile = await prisma.profile_data.findFirst({
      include: {
        kabinet: {
          include: {
            pengurus_kabinet_gubernur_idTopengurus: true,
            pengurus_kabinet_wakil_idTopengurus: true,
          },
        },
      },
    });

    return { status: 200, data: profile };
  },
};
