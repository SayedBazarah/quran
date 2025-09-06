import { RequestHandler } from "express";
import { CourseRepository } from "../infrastructure/course.prisma.repository";
import { prisma } from "@/shared/prisma/client";
import { CreateCourseUseCase } from "../application/create-course";
import { UpdateCourseUseCase } from "../application/update-course";
import { DeleteCourseUseCase } from "../application/delete-course";

export class CourseController {
  private repo: CourseRepository;

  constructor() {
    this.repo = new CourseRepository(prisma);
  }

  list: RequestHandler = async (req, res) => {
    const courses = await this.repo.findAll();
    res.json(courses);
  };

  create: RequestHandler = async (req, res) => {
    const { name, duration, price } = req.body;
    const useCase = new CreateCourseUseCase(this.repo);

    const course = await useCase.execute(name, duration, price);

    res.json(course);
  };

  update: RequestHandler = async (req, res) => {
    const { name, duration, price } = req.body;
    const useCase = new UpdateCourseUseCase(this.repo);

    const course = await useCase.execute(req.params.id, name, duration, price);

    res.json(course);
  };

  delete: RequestHandler = async (req, res) => {
    const useCase = new DeleteCourseUseCase(this.repo);

    await useCase.execute(req.params.id);

    res.json({ message: "Course deleted" });
  };
}
