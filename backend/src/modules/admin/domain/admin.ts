import { compare } from "@/shared/auth/hashing";
import { Admin as IAdmin } from "@prisma/client";
export class Admin {
  constructor(private readonly admin: IAdmin) {}

  getAdmin<K extends keyof IAdmin>(field?: K): IAdmin[K] | IAdmin {
    return (field && this.admin[field]) || this.admin;
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.admin.password) return Promise.resolve(false);
    return compare(password, this.admin.password);
  }
}
