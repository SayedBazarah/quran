import { Admin } from "@prisma/client";

export interface IAdminController {
  create(
    admin: Pick<
      Admin,
      | "name"
      | "email"
      | "phone"
      | "password"
      | "nationalId"
      | "nationalIdImg"
      | "username"
      | "avatar"
    >
  ): Promise<Admin>;
}
