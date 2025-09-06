import { Course, PrismaClient } from "@prisma/client";
import { ICourseRepository } from "../domain/course-repository";

export class CourseRepository implements ICourseRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany();
    return courses;
  }

  async create(course: Course): Promise<Course> {
    const createdCourse = await this.prisma.course.create({
      data: course,
    });
    return createdCourse;
  }

  async update(course: Course): Promise<Course> {
    const updatedCourse = await this.prisma.course.update({
      where: { id: course.id },
      data: course,
    });
    return updatedCourse;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id },
    });
  }
}
