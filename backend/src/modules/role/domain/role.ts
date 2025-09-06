import { Role as IRole } from "@prisma/client";
export class Role {
  constructor(private readonly role: IRole) {}

  getRole<K extends keyof IRole>(field?: K): IRole[K] | IRole {
    return (field && this.role[field]) || this.role;
  }
}
