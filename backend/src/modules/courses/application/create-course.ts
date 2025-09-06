import { Course } from "@prisma/client";
import { ICourseRepository } from "../domain/course-repository";

export class CreateCourseUseCase {
  constructor(private repo: ICourseRepository) {}

  async execute(
    name: string,
    duration: number,
    price: number
  ): Promise<Course> {
    // Create a new course
    const newCourse = await this.repo.create({
      name,
      duration,
      price,
    });

    return newCourse; // Placeholder for actual course creation logic
  }
}
