import { Enrollment } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";

export class PendingEnrollmentsUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(): Promise<Enrollment[]> {
    // Create a new admin
    const enrollments = await this.repo.pendingEnrollments();

    return enrollments; // Placeholder for actual admin creation logic
  }
}
