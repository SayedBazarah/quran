import { Admin } from "@prisma/client";
import { IAdminRepository } from "../domain/admin-repository";

export class UpdateAdminUseCase {
  constructor(private repo: IAdminRepository) {}

  async execute(body: Partial<Admin> & { id: string }): Promise<Admin> {
    // Validate if the admin already exists
    const existingAdmin = await this.repo.findById(body.id);
    if (!existingAdmin) {
      throw new Error("Admin with this ID does not exist");
    }

    // Create a new admin
    const newAdmin = await this.repo.update({
      ...body, // Update with the provided fields
    });

    return newAdmin; // Placeholder for actual admin creation logic
  }
}
