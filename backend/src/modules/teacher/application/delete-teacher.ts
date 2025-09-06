import { ITeacherRepository } from "../domain/teacher-repository";

export class DeleteTeacherUseCase {
  constructor(private repo: ITeacherRepository) {}

  async execute(id: string): Promise<void> {
    // Delete teacher
    const deletedTeacher = await this.repo.delete(id);

    return deletedTeacher;
  }
}
