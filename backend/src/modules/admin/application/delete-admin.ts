import { IAdminRepository } from "../domain/admin-repository";

export class DeleteAdminUseCase {
  constructor(private repo: IAdminRepository) {}

  async execute(id: string): Promise<boolean> {
    // Delete a admin
    await this.repo.delete(id);

    return true; // Placeholder for actual admin creation logic
  }
}
