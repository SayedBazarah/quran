import { ICourseRepository } from "../domain/course-repository";

export class DeleteCourseUseCase {
  constructor(private repo: ICourseRepository) {}

  async execute(id: string): Promise<void> {
    // Create a new course
    const deletedCourse = await this.repo.delete(id);

    return deletedCourse; // Placeholder for actual course creation logic
  }
}
