import { Student } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";

export class CreateStudentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(student: Partial<Student>): Promise<Student> {
    // Validate if the admin already exists
    const existingAdmin = await this.repo.findByPhone(student.phone as string);

    if (existingAdmin) {
      throw new Error("Student with this email already exists");
    }

    // Create a new admin
    const newStudent = await this.repo.create(student);

    return newStudent; // Placeholder for actual admin creation logic
  }
}
