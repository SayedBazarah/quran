import { Student } from "@prisma/client";
import { IStudentRepository } from "../domain/student-repository";
import { NotFoundError } from "@/shared/errors";

export class StudentsDetailsUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(id: string): Promise<Student> {
    const adminsData = await this.repo.findById(id);
    if (!adminsData) {
      throw new NotFoundError("Student not found");
    }
    return adminsData;
  }
}
