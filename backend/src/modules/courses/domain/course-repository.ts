import { Course } from "@prisma/client";

export interface ICourseRepository {
  // List
  create(course: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Course[]>;
  update(course: Partial<Course>): Promise<Course>;
}
