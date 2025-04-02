import prisma from "../../prisma/prismaClient.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default {
  async addAdmin(username, password) {
    const existingAdmin = await prisma.admin.findFirst({
      where: { username: username },
    });

    if (existingAdmin) {
      return { status: 400, message: "Username already used" };
    }

    const id = nanoid();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        id,
        username,
        password: hashedPassword,
      },
    });

    return { status: 201, data: newAdmin };
  },

  async adminLogin(username, password) {
    const admin = await prisma.admin.findFirst({ where: { username } });

    if (!admin) {
      return { status: 404, message: "Admin not found" };
    }

    const hashedPassword = admin.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      return { status: 401, message: "Username or password incorrect" };
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET);

    return { status: 200, token, admin };
  },

  async getAllAdmin() {
    const allAdmin = await prisma.admin.findMany();

    if (allAdmin.length == 0) {
      return { status: 404, message: "Admin List Empty" };
    }

    return { status: 200, allAdmin };
  },
};
