import prisma from "../../prisma/prismaClient.js";
import supabase from "../../lib/supabase/supabaseClient.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();
const BUCKET_NAME = process.env.BUCKET_NAME;
const FILE_URL = process.env.FILE_URL;
const extension = ".jpg";

export default {
  async addDivision(type, name_short, fullname, description) {
    const exisitingDivision = await prisma.division.findFirst({
      where: {
        OR: [name_short, fullname],
      },
    });

    if (exisitingDivision) {
      return { status: 400, message: "Division Already Exist" };
    }

    const id = nanoid();
    const division = await prisma.division.create({
      data: {
        id,
        type,
        name_short,
        fullname,
        description,
      },
    });

    return { status: 201, data: division };
  },

  async editDivision(id, type, name_short, fullname, description) {
    const findDivision = await prisma.division.findFirst({
      where: { id },
    });

    if (!findDivision) {
      return { status: 404, message: "Division Not Found" };
    }

    const division = await prisma.division.update({
      where: { id },
      data: {
        type,
        name_short,
        fullname,
        description,
      },
    });

    return { status: 200, data: division };
  },

  async removeDivision(id) {
    const findDivision = await prisma.division.findFirst({
      where: { id },
    });

    if (!findDivision) {
      return { status: 404, message: "Division Not Found" };
    }

    const division = await prisma.division.delete({
      where: { id },
    });

    return { status: 200, data: division };
  },

  async addPengurusDivision(pengurus_id, division_id, departemen, bidang) {
    const exisitingDivision = await prisma.division_pengurus.findFirst({
      where: {
        AND: [division_id, pengurus_id],
      },
    });

    if (exisitingDivision) {
      return { status: 400, message: "Pengurus Already Added to Divison" };
    }

    const id = nanoid();
    const division = await prisma.division_pengurus.create({
      data: {
        id,
        division_id,
        pengurus_id,
        departemen,
        bidang,
      },
    });

    return { status: 201, data: division };
  },

  async editPengurusDivision(id, departemen, bidang) {
    const findDivision = await prisma.division_pengurus.findFirst({
      where: { id },
    });

    if (!findDivision) {
      return { status: 404, message: "Pengurus Division Not Found" };
    }

    const division = await prisma.division_pengurus.update({
      where: { id },
      data: {
        departemen,
        bidang,
      },
    });

    return { status: 200, data: division };
  },

  async removePengurusDivision(id) {
    const findDivision = await prisma.division_pengurus.findFirst({
      where: { id },
    });

    if (!findDivision) {
      return { status: 404, message: "Pengurus Division Not Found" };
    }

    const division = await prisma.division_pengurus.delete({
      where: { id },
    });

    return { status: 200, data: division };
  },

  async getAllDivision() {
    const division = await prisma.division.findMany();
    return { status: 200, data: division };
  },

  async getDivisionById(id) {
    const division = await prisma.division.findFirst({
      where: { id },
      include: {
        division_pengurus: {
          include: {
            pengurus: true,
          },
        },
      },
    });

    if (!division) {
      return { status: 404, message: "Division Not Found" };
    }

    return { status: 200, data: division };
  },
};
