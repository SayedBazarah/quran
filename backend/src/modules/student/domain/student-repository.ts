import { Enrollment, Parent, Student } from "@prisma/client";

export interface IStudentRepository {
  pendingEnrollments(): Promise<Enrollment[]>;
  acceptEnrollment(id: string): Promise<Boolean>;
  findActiveEnrollment(studentId: string): Promise<Enrollment | null>;
  findByPhone(id: string): Promise<Student | null>;
  findById(id: string): Promise<Student | null>;
  createUpdateParent(parent: Parent): Promise<Parent>;
  isEnrollmentRegisted(
    courseId: string,
    studentId: string
  ): Promise<Enrollment | null>;
  createEnrollment(enrollment: Partial<Enrollment>): Promise<Enrollment>;
  createEnrollmentLog(
    studentId: string,
    enrollmentId: string,
    adminId: string,
    note: string
  ): Promise<Boolean>;
  // List
  create(student: Partial<Student>): Promise<Student>;
  closeEnrollment(enrollmentId: string): Promise<Boolean>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Student[]>;
  update(student: Partial<Student>): Promise<Student>;
  updateEnrollment(enrollment: Partial<Enrollment>): Promise<Boolean>;
}
