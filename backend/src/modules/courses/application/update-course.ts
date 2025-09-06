import { Course } from "@prisma/client";
import { ICourseRepository } from "../domain/course-repository";

export class UpdateCourseUseCase {
  constructor(private repo: ICourseRepository) {}

  async execute(
    id: string,
    name: string,
    duration: number,
    price: number
  ): Promise<Course> {
    // Create a new course
    const newCourse = await this.repo.update({
      id,
      name,
      duration,
      price,
    });

    return newCourse; // Placeholder for actual course creation logic
  }
}
