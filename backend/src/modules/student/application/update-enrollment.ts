import { Enrollment } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";
import { BadRequestError } from "@/shared/errors";

export class UpdateEnrollmentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(enrollment: Partial<Enrollment>): Promise<Boolean> {
    // Validate if the admin already exists
    const alreadyRegistered = await this.repo.isEnrollmentRegisted(
      enrollment.studentId as string,
      enrollment.courseId as string
    );

    if (!alreadyRegistered) {
      throw new BadRequestError("لم يتم التسجيل بهذه الدورة");
    }

    // Create a new admin
    await this.repo.updateEnrollment(enrollment);

    return true; // Placeholder for actual admin creation logic
  }
}
