import { Role } from "../domain/role";
import { IRoleRepository } from "../domain/role-repository";

export class CreateRoleUseCase {
  constructor(private repo: IRoleRepository) {}

  async execute(
    name: string,
    isDefault: boolean,
    permissions: string[]
  ): Promise<Role> {
    // Create a new role
    const newRole = await this.repo.create({
      name,
      isDefault,
      permissions,
    });

    return new Role(newRole); // Placeholder for actual role creation logic
  }
}
