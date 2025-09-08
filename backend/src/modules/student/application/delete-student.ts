import { IStudentRepository } from "../domain/student-repository";

export class DeleteStudentUseCase {
  constructor(private repo: IStudentRepository) {}

  async execute(id: string): Promise<Boolean> {
    await this.repo.delete(id);
    return true;
  }
}
