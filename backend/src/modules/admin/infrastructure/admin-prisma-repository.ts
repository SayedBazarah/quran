import { Admin, PrismaClient } from "@prisma/client";
import { IAdminRepository } from "../domain/admin-repository";

export class AdminPrismaRepository implements IAdminRepository {
  constructor(private prisma: PrismaClient) {}

  findById(id: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { id },
    });
  }
  findByEmail(email?: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }
  async create({ id, roleId, branchId, ...admin }: Admin): Promise<Admin> {
    const res = await this.prisma.admin.create({
      data: {
        ...admin,
        ...(roleId ? { role: { connect: { id: roleId } } } : {}),
        ...(branchId ? { branch: { connect: { id: branchId } } } : {}),
      },
      include: {
        role: true,
        branch: true,
      },
    });
    return res;
  }
  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({
      where: { id },
    });
  }
  findAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany({
      include: {
        role: true,
        branch: true,
      },
    });
  }
  update({ id, roleId, branchId, ...admin }: Admin): Promise<Admin> {
    // Remove role and branch from ...admin to avoid nested objects
    const { password, ...adminData } = admin;

    return new Promise((resolve, reject) => {
      this.prisma.admin
        .update({
          where: { id },
          data: {
            ...adminData,
            ...(password && password.length > 0 && { password }),
            ...(roleId ? { role: { connect: { id: roleId } } } : {}),
            ...(branchId ? { branch: { connect: { id: branchId } } } : {}),
          },
          include: {
            role: true,
            branch: true,
          },
        })
        .then((updatedAdmin) => {
          if (updatedAdmin) {
            resolve(updatedAdmin);
          } else {
            reject(new Error("Admin not found"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  validatePassword(password: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
