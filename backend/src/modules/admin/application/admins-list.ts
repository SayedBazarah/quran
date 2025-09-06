import { Admin } from "../domain/admin";
import { IAdminRepository } from "../domain/admin-repository";

export class AdminsListUseCase {
  constructor(private repo: IAdminRepository) {}

  async execute(): Promise<Admin[]> {
    const adminsData = await this.repo.findAll();
    return adminsData.map((data) => new Admin(data));
  }
}
