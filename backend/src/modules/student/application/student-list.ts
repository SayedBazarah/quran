import { Student } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";

export class StudentsListUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(): Promise<Student[]> {
    const adminsData = await this.repo.findAll();
    return adminsData;
  }
}
