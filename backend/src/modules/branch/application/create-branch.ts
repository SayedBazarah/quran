import { Branch } from "@prisma/client";
import { IBranchRepository } from "../domain/branch-repository";

export class CreateBranchUseCase {
  constructor(private repo: IBranchRepository) {}

  async execute(name: string, phone: string, address: string): Promise<Branch> {
    // Create a new Branch
    const newBranch = await this.repo.create({
      name,
      phone,
      address,
    });

    return newBranch; // Placeholder for actual Branch creation logic
  }
}
