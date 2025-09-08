import { IStudentRepository } from "../domain/student-repository";

export class CreateEnrollmentLogUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(
    studentId: string,
    enrollmentId: string,
    adminId: string,
    note: string
  ): Promise<Boolean> {
    // Create a Log
    await this.repo.createEnrollmentLog(studentId, enrollmentId, adminId, note);

    return true;
  }
}
