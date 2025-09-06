import { RequestHandler } from "express";
import { AdminPrismaRepository } from "../infrastructure/admin-prisma-repository";
import { CreateAdminUseCase } from "../application/create-admin";
import { prisma } from "@/shared/prisma/client";
import { saveFiles } from "@/shared/utils/file";
import { hash } from "@/shared/auth/hashing";
import { env } from "@/env";
import { UpdateAdminUseCase } from "../application/update-admin";

// Define the interface
export interface IAdminController {
  list: RequestHandler<{}, {}, {}>;
  create: RequestHandler<{}, {}, {}>;
  // Add other methods as needed
}

export class AdminController implements IAdminController {
  private repo: AdminPrismaRepository;
  constructor() {
    this.repo = new AdminPrismaRepository(prisma);
  }

  list: RequestHandler = async (req, res) => {
    const admins = await this.repo.findAll();
    res.json(admins);
  };

  create: RequestHandler = async (req, res) => {
    const files = req.files as unknown as {
      avatar: Express.Multer.File[];
      nationalIdImg: Express.Multer.File[];
    };
    const avatar = files.avatar[0];
    const nationalIdImg = files.nationalIdImg[0];

    if (!files.avatar || !files.nationalIdImg) {
      throw new Error("No files uploaded");
    }

    const { name, email, phone, password, nationalId } = req.body;

    const useCase = new CreateAdminUseCase(this.repo);

    const admin = await useCase.execute(
      `${env.MEDIA_URL}/admin/avatar/${avatar.filename}`,
      name,
      email,
      phone,
      await hash("sayed"),
      nationalId,
      `${env.MEDIA_URL}/admin/ids/${nationalIdImg.filename}`
    );

    try {
      await saveFiles("/admin/avatar", avatar);
      await saveFiles("/admin/ids", nationalIdImg);
    } catch (err) {
      console.log(err);
    }
    res.json(admin);
  };
  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    console.log("--- update admin logs ---", {
      id,
      body: req.body,
    });
    const useCase = new UpdateAdminUseCase(this.repo);

    const admin = await useCase.execute({
      id,
      ...req.body,
      ...(req.body?.password && {
        password: await hash(req.body.password as string),
      }),
      ...(req.file && {
        avatar: `${env.MEDIA_URL}/admin/avatar/${req.file.filename}`,
      }),
    });

    if (req.file) {
      await saveFiles("admin/avatar", req.file);
    }

    res.json(admin);
  };
}
