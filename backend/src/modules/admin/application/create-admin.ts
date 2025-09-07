import { Admin } from "@prisma/client";
import { IAdminRepository } from "../domain/admin-repository";

export class CreateAdminUseCase {
  constructor(private repo: IAdminRepository) {}

  async execute(admin: Partial<Admin>): Promise<Admin> {
    // Validate if the admin already exists
    const existingAdmin = await this.repo.findByEmail(`${admin.email}`);

    if (existingAdmin) {
      throw new Error("Admin with this email already exists");
    }

    // Create a new admin
    const newAdmin = await this.repo.create(admin);

    return newAdmin; // Placeholder for actual admin creation logic
  }
}
