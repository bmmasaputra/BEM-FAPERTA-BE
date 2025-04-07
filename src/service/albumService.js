import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async addAlbum(body, admin) {
    const id = nanoid();
    const { name, desc } = body;
    const created_at = new Date().toISOString();

    const existingAlbum = await prisma.album.findMany({
      where: { name: name },
    });

    if (existingAlbum) {
      return { status: 400, message: "Album Already Exist" };
    }

    const insertAlbum = await prisma.album.create({
      data: { id, name, desc, created_at, publisher_id: admin.id },
    });

    return { status: 201, data: insertAlbum };
  },

  async editAlbum(body, admin) {
    const { id, name, desc } = body;

    const findAlbum = await prisma.album.findFirst({
      where: { id: id },
    });

    if (!findAlbum) {
      return { status: 404, message: "Album Not Found" };
    }

    const edit = await prisma.album.update({
      where: { id },
      data: {
        name,
        desc,
      },
    });

    return { status: 200, data: edit };
  },

  async removeAlbum(id, admin) {
    const findAlbum = await prisma.album.findFirst({
      where: { id: id },
    });

    if (!findAlbum) {
      return { status: 404, message: "Album Not Found" };
    }

    const remove = await prisma.album.delete({
      where: { id },
    });

    return { status: 200, data: remove };
  },

  async getAllAlbum() {
    const album = await prisma.album.findMany();
    return album;
  },

  async getAlbumById(id) {
    const album = await prisma.album.findFirst({
      where: id,
      include: {
        album_images: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!album) {
      return { status: 404, message: "Album Not Found" };
    }

    return { status: 200, data: album };
  },
};
