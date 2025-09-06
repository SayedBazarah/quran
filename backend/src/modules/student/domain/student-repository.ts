import { Enrollment, Parent, Student } from "@prisma/client";

export interface IStudentRepository {
  findByPhone(id: string): Promise<Student | null>;
  findById(id: string): Promise<Student | null>;
  createUpdateParent(parent: Parent): Promise<Parent>;
  isEnrollmentRegisted(studentId: string, courseId: string): Promise<boolean>;
  createEnrollment(enrollment: Partial<Enrollment>): Promise<Enrollment>;

  // List
  create(student: Partial<Student>): Promise<Student>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Student[]>;
  update(student: Partial<Student>): Promise<Student>;
}
