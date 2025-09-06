import { Role } from "../domain/role";
import { IRoleRepository } from "../domain/role-repository";

export class UpdateRoleUseCase {
  constructor(private repo: IRoleRepository) {}

  async execute(
    id: string,
    name: string,
    isDefault: boolean,
    permissions: string[]
  ): Promise<Role> {
    // Create a new role
    const newRole = await this.repo.update({
      id,
      name,
      isDefault,
      permissions,
    });

    return new Role(newRole); // Placeholder for actual role creation logic
  }
}
