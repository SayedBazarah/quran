import { IBranchRepository } from "../domain/branch-repository";

export class DeleteBranchUseCase {
  constructor(private repo: IBranchRepository) {}

  async execute(id: string): Promise<Boolean> {
    // Create a new role
    await this.repo.delete(id);

    return true; // Placeholder for actual role creation logic
  }
}
