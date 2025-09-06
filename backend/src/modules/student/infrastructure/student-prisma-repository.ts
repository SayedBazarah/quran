import { Enrollment, Parent, PrismaClient, Student } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";

export class StudentPrismaRepository implements IStudentRepository {
  constructor(private prisma: PrismaClient) {}

  findByPhone(phone: string): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { phone },
    });
  }

  findById(id: string): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        branch: true,
        admin: true,
        enrollments: {
          include: {
            course: true,
            admin: true,
            teacher: true,
          },
        },
        parent: true,
      },
    });
  }
  async isEnrollmentRegisted(
    studentId: string,
    courseId: string
  ): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    return !!enrollment;
  }

  async createEnrollment(data: Enrollment): Promise<Enrollment> {
    return this.prisma.enrollment.create({
      data,
      include: {
        student: true,
        course: true,
        admin: true,
      },
    });
  }

  async createUpdateParent(parent: Parent) {
    // Upsert parent based on unique identifier (e.g., id or phone)
    return this.prisma.parent.upsert({
      where: { id: parent.id },
      update: { ...parent },
      create: { ...parent },
    });
  }
  async create(
    student: Omit<
      Student,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "branch"
      | "teacher"
      | "admin"
      | "enrollments"
    > & { branchId?: string }
  ): Promise<Student> {
    const { branchId, ...studentData } = student;
    const res = await this.prisma.student.create({
      data: {
        ...studentData,
        ...(branchId ? { branchId } : {}), // use branchId instead of branch.connect
      },
      include: {
        branch: true,
      },
    });

    return res;
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findAll(): Promise<Student[]> {
    return this.prisma.student.findMany({
      include: {
        branch: true,
        admin: true,
        enrollments: true,
      },
    });
  }

  update({ id, branchId, ...student }: Student): Promise<Student> {
    // Remove branch from ...student to avoid nested objects
    const { ...studentData } = student;

    return this.prisma.student.update({
      where: { id },
      data: {
        ...studentData,
      },
      include: {
        branch: true,
        admin: true,
        enrollments: true,
      },
    });
  }
}
