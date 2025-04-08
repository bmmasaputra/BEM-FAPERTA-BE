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

    if (!existingAlbum) {
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

    await prisma.album_images.deleteMany({
      where: {
        album_id: id,
      },
    });

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
      where: {
        id,
      },
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

  async addPhotoToAlbum(body, file) {
    const { name, desc, album_id } = body;
    const id = nanoid();
    const type = "Photo";

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`album/${album_id}/${id}.jpg`, file, {
        contentType: "image/jpg",
      });

    if (error) {
      throw new Error("Supabase Error: " + JSON.stringify(error));
    }

    const img_url = FILE_URL + data.fullPath;

    const addImage = await prisma.images.create({
      data: {
        id,
        name,
        desc,
        type,
        img_url,
        album_images: {
          create: [
            {
              id: nanoid(),
              album: {
                connect: { id: album_id },
              },
            },
          ],
        },
      },
      include: {
        album_images: true,
      },
    });

    const incPhoto = await prisma.album.update({
      where: {
        id: album_id,
      },
      data: {
        photos_count: {
          increment: 1,
        },
      },
    });

    return { status: 201, data: addImage };
  },

  async removeImageFromAlbum(id) {
    const findImage = await prisma.images.findFirst({
      where: {
        id,
      },
    });

    if (!findImage) {
      return { status: 404, message: "Image Not Found" };
    }

    const path = findImage.img_url.split("bucket/")[1];

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      throw new Error("Supabase Error: " + JSON.stringify(error));
    }

    await prisma.album_images.deleteMany({
      where: {
        images_id: id,
      },
    });

    const remove = await prisma.images.delete({
      where: {
        id,
      },
    });

    return { status: 200, data: remove };
  },
};
