import { Student } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";

export class UpdateStudentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(body: Partial<Student> & { id: string }): Promise<Student> {
    // Validate if the admin already exists
    const existingAdmin = await this.repo.findById(body.id);
    if (!existingAdmin) {
      throw new Error("Admin with this ID does not exist");
    }

    // Create a new admin
    const newStudent = await this.repo.update({
      ...body, // Update with the provided fields
    });

    return newStudent; // Placeholder for actual admin creation logic
  }
}
