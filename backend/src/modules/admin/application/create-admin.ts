import { Admin } from "../domain/admin";
import { IAdminRepository } from "../domain/admin-repository";

export class CreateAdminUseCase {
  constructor(private repo: IAdminRepository) {}

  async execute(
    avatar: string,
    name: string,
    email: string | undefined,
    phone: string,
    password: string | null,
    nationalId: string,
    nationalIdImg: string | null
  ): Promise<Admin> {
    // Validate if the admin already exists
    const existingAdmin = await this.repo.findByEmail(email);

    if (existingAdmin) {
      throw new Error("Admin with this email already exists");
    }

    // Create a new admin
    const newAdmin = await this.repo.create({
      avatar,
      name,
      email,
      phone,
      password,
      nationalId,
      nationalIdImg,
      username: `u-${Math.floor(1000 + Math.random() * 90000)}`, // Example username generation
    });

    return new Admin(newAdmin); // Placeholder for actual admin creation logic
  }
}
