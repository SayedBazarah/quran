import { Branch } from "@prisma/client";
import { IBranchRepository } from "../domain/branch-repository";

export class UpdateBranchUseCase {
  constructor(private repo: IBranchRepository) {}

  async execute(
    id: string,
    name: string,
    phone: string,
    address: string
  ): Promise<Branch> {
    // Create a new role
    const newRole = await this.repo.update({
      id,
      name,
      phone,
      address,
    });

    return newRole; // Placeholder for actual role creation logic
  }
}
