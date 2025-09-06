import { Course } from "@prisma/client";
import { ICourseRepository } from "../domain/course-repository";

export class CoursesListUseCase {
  constructor(private repo: ICourseRepository) {}

  async execute(): Promise<Course[]> {
    const coursesData = await this.repo.findAll();
    return coursesData;
  }
}
