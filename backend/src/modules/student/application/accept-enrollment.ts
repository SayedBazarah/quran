import { IStudentRepository } from "../domain/student-repository";

export class AcceptEnrollmentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(enrollmentId: string): Promise<Boolean> {
    await this.repo.acceptEnrollment(enrollmentId);

    return true; // Placeholder for actual admin creation logic
  }
}
