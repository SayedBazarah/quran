import { Teacher } from "@prisma/client";
import { ITeacherRepository } from "../domain/teacher-repository";

export class CreateTeacherUseCase {
  constructor(private repo: ITeacherRepository) {}

  async execute(teacher: Partial<Teacher>): Promise<Teacher> {
    // Create a new course
    const newTeacher = await this.repo.create({
      ...teacher,
    });

    return newTeacher;
  }
}
