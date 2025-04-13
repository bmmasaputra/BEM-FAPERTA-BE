import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async addPengurus(body, file) {
    const { nim, fullname, jurusan } = body;
    const id = nanoid();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("pengurus/" + id + ".jpg", file, { contentType: "image/jpg" });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const img_url = FILE_URL + data.fullPath;

    const add = await prisma.pengurus.create({
      data: {
        id,
        nim,
        fullname,
        jurusan,
        img_url,
      },
    });

    return { status: 201, data: add };
  },

  async editPengurus(body, file) {
    const { id, nim, fullname, jurusan, img_url } = body;

    const findPengurus = await prisma.pengurus.findFirst({
      where: { id },
    });

    if (!findPengurus) {
      return { status: 404, message: "Pengurus Not Found" };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload("pengurus/" + id + ".jpg", {
        contentType: "image/jpg",
        upsert: true,
      });

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const edit = await prisma.pengurus.update({
      where: { id },
      data: {
        nim,
        fullname,
        jurusan,
      },
    });

    return { status: 200, data: edit };
  },

  async removePengurus(id) {
    const findPengurus = await prisma.pengurus.findFirst({
      where: { id },
    });

    if (!findPengurus) {
      return { status: 404, message: "Pengurus Not Found" };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(["pengurus/" + id + ".jpg"]);

    if (error) {
      throw new Error("Supabase Error: " + error.message);
    }

    const remove = await prisma.artikel.delete({
      where: { id },
    });

    return { status: 200, data: remove };
  },

  async addContact(pengurus_id, link, contact_type) {
    const findPengurus = await prisma.pengurus.findFirst({
      where: { pengurus_id },
    });

    if (!findPengurus) {
      return { status: 404, message: "Pengurus Not Found" };
    }

    const id = nanoid();

    const add = await prisma.pengurus_contact({
      data: {
        id,
        pengurus_id,
        link,
        contact_type,
      },
    });

    return { status: 201, data: add };
  },

  async removeContact(id) {
    const findContact = await prisma.pengurus_contact.findFirst({
      where: { id },
    });

    if (!findContact) {
      return { status: 404, message: "Contact Not Found" };
    }

    const remove = await prisma.pengurus_contact.delete({
      where: { id },
    });

    return { status: 200, data: remove };
  },

  async getAllPengurus() {
    const pengurus = await prisma.pengurus.findMany({
      include: {
        pengurus_contact: true,
      },
    });

    return { status: 200, data: getAll };
  },

  async getPengurusById(id) {
    const pengurus = await prisma.pengurus.findFirst({
      where: { id },
      include: {
        pengurus_contact: true,
      },
    });

    if (!pengurus) {
      return { status: 404, message: "Pengurus Not Found" };
    }

    return { status: 200, data: pengurus };
  },
};
