import { RequestHandler } from "express";
import { StudentPrismaRepository } from "../infrastructure/student-prisma-repository";
import { CreateStudentUseCase } from "../application/create-student";
import { prisma } from "@/shared/prisma/client";
import { saveFiles } from "@/shared/utils/file";
import { env } from "@/env";
import { UpdateStudentUseCase } from "../application/update-student";
import { StudentsDetailsUseCase } from "../application/get-student-details";
import { CreateUpdateParentUseCase } from "../application/create-update-parent";
import { CreateEnrollmentUseCase } from "../application/create-enrollment";
import { CreateEnrollmentLogUseCase } from "../application/create-log";
import { UpdateEnrollmentUseCase } from "../application/update-enrollment";

// Define the interface
export interface IAdminController {
  list: RequestHandler<{}, {}, {}>;
  create: RequestHandler<{}, {}, {}>;
}

export class AdminController implements IAdminController {
  private repo: StudentPrismaRepository;
  constructor() {
    this.repo = new StudentPrismaRepository(prisma);
  }

  list: RequestHandler = async (req, res) => {
    const admins = await this.repo.findAll();
    res.json(admins);
  };
  details: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const useCase = new StudentsDetailsUseCase(this.repo);

    const student = await useCase.execute(id);

    res.json(student);
  };

  createEnrollment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const useCase = new CreateEnrollmentUseCase(this.repo);
    await useCase.execute({
      ...req.body,
      studentId: id,
      status: "active",
    });

    res.json({ message: "Enrollment created successfully" });
  };
  createParent: RequestHandler = async (req, res) => {
    const file = req.file as Express.Multer.File;

    const useCase = new CreateUpdateParentUseCase(this.repo);
    const student = await useCase.execute({
      id: req.body.studentId,
      ...req.body,
      ...(file && {
        nationalIdImg: `${env.MEDIA_URL}/parent/ids/${file.filename}`,
      }),
    });

    if (file) {
      await saveFiles("parent/ids", file);
    }

    res.json(student);
  };
  createEnrollmentLog: RequestHandler = async (req, res) => {
    const useCase = new CreateEnrollmentLogUseCase(this.repo);
    const { id } = req.params;
    const adminId = req.user?.id as string;
    const { enrollmentId, note } = req.body;
    await useCase.execute(id, enrollmentId, adminId, note);

    res.json({ message: "Enrollment log created successfully" });
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

    const useCase = new CreateStudentUseCase(this.repo);

    const admin = await useCase.execute({
      ...req.body,
      avatar: `${env.MEDIA_URL}/student/avatar/${avatar.filename}`,
      nationalIdImg: `${env.MEDIA_URL}/student/ids/${nationalIdImg.filename}`,
    });

    try {
      await saveFiles("/student/avatar", avatar);
      await saveFiles("/student/ids", nationalIdImg);
    } catch (err) {
      console.log("--- err ---");
      console.log(err);
    }
    res.json(admin);
  };
  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const useCase = new UpdateStudentUseCase(this.repo);

    const admin = await useCase.execute({
      id,
      ...req.body,
      ...(req.file && {
        avatar: `${env.MEDIA_URL}/student/avatar/${req.file.filename}`,
      }),
    });

    if (req.file) {
      await saveFiles("student/avatar", req.file);
    }

    res.json(admin);
  };

  updateEnrollment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const useCase = new UpdateEnrollmentUseCase(this.repo);

    await useCase.execute({
      id,
      ...req.body,
    });

    res.json({ message: "Enrollment updated successfully" });
  };
}
