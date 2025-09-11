import { Enrollment } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";
import { BadRequestError } from "@/shared/errors";

export class CreateEnrollmentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(enrollment: Partial<Enrollment>): Promise<Enrollment> {
    // Validate if the admin already exists
    const alreadyRegistered = await this.repo.isEnrollmentRegisted(
      enrollment.studentId as string,
      enrollment.courseId as string
    );

    if (alreadyRegistered) {
      throw new BadRequestError("الطالب مسجل مسبقاً بهذه الدورة");
    }

    const hasActiveEnrollment = await this.repo.findActiveEnrollment(
      enrollment.studentId as string
    );
    if (hasActiveEnrollment) {
      throw new BadRequestError("الطالب لدية دورة غير منتهية");
    }
    // Create a new admin
    const newEnrollment = await this.repo.createEnrollment(enrollment);

    return newEnrollment; // Placeholder for actual admin creation logic
  }
}
