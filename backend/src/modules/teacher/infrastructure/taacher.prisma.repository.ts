import { Teacher, PrismaClient } from "@prisma/client";
import { ITeacherRepository } from "../domain/teacher-repository";

export class TeacherRepository implements ITeacherRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<Teacher[]> {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        branch: true,
        // students length how many students teacher teaches
      },
    });
    return teachers;
  }

  async create(teacher: Teacher): Promise<Teacher> {
    const { branchId, ...teacherData } = teacher;

    const createdteacher = await this.prisma.teacher.create({
      data: {
        ...teacherData,
        ...(branchId ? { branch: { connect: { id: branchId } } } : {}),
      },
      include: {
        branch: true,
        students: true,
      },
    });
    return createdteacher;
  }

  async update(teacher: Teacher): Promise<Teacher> {
    const updatedTeacher = await this.prisma.teacher.update({
      where: { id: teacher.id },
      data: teacher,
    });
    return updatedTeacher;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.teacher.delete({
      where: { id },
    });
  }
}
