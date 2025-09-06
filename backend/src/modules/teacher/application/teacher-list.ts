import { Teacher } from "@prisma/client";
import { ITeacherRepository } from "../domain/teacher-repository";

export class TeachersListUseCase {
  constructor(private repo: ITeacherRepository) {}

  async execute(): Promise<Teacher[]> {
    const teachersData = await this.repo.findAll();
    return teachersData;
  }
}
