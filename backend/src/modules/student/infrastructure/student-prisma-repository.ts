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
            enrollmentLogs: {
              include: {
                admin: true,
              },
            },
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

  async createEnrollmentLog(
    studentId: string,
    enrollmentId: string,
    adminId: string,
    note: string
  ): Promise<Boolean> {
    // Create a Log
    await this.prisma.enrollmentLog.create({
      data: {
        studentId,
        enrollmentId,
        adminId,
        note,
      },
      include: {
        student: true,
        enrollment: true,
        admin: true,
      },
    });

    return true;
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
    const { branchId, adminId, ...studentData } = student;
    const res = await this.prisma.student.create({
      data: {
        ...studentData,
        ...(adminId ? { adminId } : {}),
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

  update({ id, adminId, branchId, ...student }: Student): Promise<Student> {
    // Remove branch from ...student to avoid nested objects
    return this.prisma.student.update({
      where: { id },
      data: {
        ...student,
        ...(branchId ? { branchId } : {}), // use branchId instead of branch.connect
        ...(adminId ? { adminId } : {}), // use adminId instead of admin.connect
      },
      include: {
        branch: true,
        admin: true,
        enrollments: true,
      },
    });
  }
  updateEnrollment({
    id,
    teacherId,
    adminId,
    ...enrollment
  }: Partial<Enrollment>): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.prisma.enrollment
        .update({
          where: { id },
          data: {
            ...enrollment,
            ...(teacherId ? { teacherId } : {}),
            ...(adminId ? { adminId } : {}),
          },
          include: {
            admin: true,
            teacher: true,
          },
        })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
