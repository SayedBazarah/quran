import { Permission } from "@prisma/client";
import { IRoleRepository } from "../domain/role-repository";

export class GetRolePermissionsUseCase {
  constructor(private repo: IRoleRepository) {}

  async execute(): Promise<Permission[]> {
    const permissionsData = await this.repo.getPermissions();
    return permissionsData;
  }
}
