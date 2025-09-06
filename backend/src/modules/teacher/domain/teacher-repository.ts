import { Teacher } from "@prisma/client";

export interface ITeacherRepository {
  // List
  create(teacher: Partial<Teacher>): Promise<Teacher>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Teacher[]>;
  update(teacher: Partial<Teacher>): Promise<Teacher>;
}
