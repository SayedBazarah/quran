import { RequestHandler } from "express";
import { prisma } from "@/shared/prisma/client";
import { TeacherRepository } from "../infrastructure/taacher.prisma.repository";
import { CreateTeacherUseCase } from "../application/create-teacher";
import { UpdateTeacherUseCase } from "../application/update-teacher";
import { DeleteTeacherUseCase } from "../application/delete-teacher";
import { env } from "@/env";
import { saveFiles } from "@/shared/utils/file";
import { hash } from "@/shared/auth/hashing";

export class TeacherController {
  private repo: TeacherRepository;

  constructor() {
    this.repo = new TeacherRepository(prisma);
  }

  list: RequestHandler = async (req, res) => {
    const courses = await this.repo.findAll();
    res.json(courses);
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

    const useCase = new CreateTeacherUseCase(this.repo);

    const course = await useCase.execute({
      ...req.body,
      username: `u-${Math.floor(1000 + Math.random() * 90000)}`, // Example username generation
      avatar: `${env.MEDIA_URL}/teacher/avatar/${avatar.filename}`,
      nationalIdImg: `${env.MEDIA_URL}/teacher/ids/${nationalIdImg.filename}`,
    });
    try {
      await saveFiles("/teacher/avatar", avatar);
      await saveFiles("/teacher/ids", nationalIdImg);
    } catch (err) {
      console.log(err);
    }
    res.json(course);
  };

  update: RequestHandler = async (req, res) => {
    const useCase = new UpdateTeacherUseCase(this.repo);

    const course = await useCase.execute(req.params.id, {
      ...req.body,
      ...(req.body?.password && {
        password: await hash(req.body.password as string),
      }),
      ...(req.file && {
        avatar: `${env.MEDIA_URL}/teacher/avatar/${req.file.filename}`,
      }),
    });
    if (req.file) {
      await saveFiles("teacher/avatar", req.file);
    }
    res.json(course);
  };

  delete: RequestHandler = async (req, res) => {
    const useCase = new DeleteTeacherUseCase(this.repo);

    await useCase.execute(req.params.id);

    res.json({ message: "Course deleted" });
  };
}
