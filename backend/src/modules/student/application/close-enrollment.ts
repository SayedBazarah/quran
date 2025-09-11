import { EnrollmentStatus } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";
import { BadRequestError } from "@/shared/errors";

export class CloseEnrollmentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(enrollmentId: string, studentId: string): Promise<Boolean> {
    // Validate if the admin already exists
    const enrollment = await this.repo.isEnrollmentRegisted(
      enrollmentId as string,
      studentId as string
    );
    if (!enrollment) {
      throw new BadRequestError("الطالب غير مسجل  بهذه الدورة");
    }
    if (enrollment.status === EnrollmentStatus.pending)
      throw new BadRequestError("لم يتم قبول الدورة من المدير حتي يتم انهائها");
    // Create a new admin
    await this.repo.closeEnrollment(enrollmentId);

    return true; // Placeholder for actual admin creation logic
  }
}
