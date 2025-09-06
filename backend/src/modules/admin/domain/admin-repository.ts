import { Admin } from "@prisma/client";

export interface IAdminRepository {
  findById(id: string): Promise<Admin | null>;
  findByEmail(email?: string): Promise<Admin | null>;

  // List
  create(admin: Partial<Admin>): Promise<Admin>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Admin[]>;
  update(admin: Partial<Admin>): Promise<Admin>;

  // Authentication
  validatePassword(password: string): Promise<boolean>;
}
