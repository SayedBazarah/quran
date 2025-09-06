import { Teacher } from "@prisma/client";
import { ITeacherRepository } from "../domain/teacher-repository";

export class UpdateTeacherUseCase {
  constructor(private repo: ITeacherRepository) {}

  async execute(id: string, name: string): Promise<Teacher> {
    // Create a new Teacher
    const newTeacher = await this.repo.update({
      id,
      name,
    });

    return newTeacher; // Placeholder for actual course creation logic
  }
}
