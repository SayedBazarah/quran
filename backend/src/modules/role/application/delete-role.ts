import { Permission } from "@prisma/client";
import { IRoleRepository } from "../domain/role-repository";

export class DeleteRoleUseCase {
  constructor(private repo: IRoleRepository) {}

  async execute(id: string): Promise<Boolean> {
    await this.repo.delete(id);
    return true;
  }
}
