import { Role } from "@prisma/client";

export interface IRoleRepository {
  // List
  create(role: Partial<Role> & { permissions: string[] }): Promise<Role>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Role[]>;
  update(role: Partial<Role> & { permissions: string[] }): Promise<Role>;
  getPermissions(): Promise<
    {
      id: string;
      code: string;
      name: string;
    }[]
  >;
}
