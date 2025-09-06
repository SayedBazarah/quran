import { Role } from "../domain/role";
import { IRoleRepository } from "../domain/role-repository";

export class RoleListUseCase {
  constructor(private repo: IRoleRepository) {}

  async execute(): Promise<Role[]> {
    const rolesData = await this.repo.findAll();
    return rolesData.map((data) => new Role(data));
  }
}
