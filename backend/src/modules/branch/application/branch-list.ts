import { Branch } from "@prisma/client";
import { IBranchRepository } from "../domain/branch-repository";

export class BranchListUseCase {
  constructor(private repo: IBranchRepository) {}

  async execute(): Promise<Branch[]> {
    const rolesData = await this.repo.findAll();
    return rolesData;
  }
}
