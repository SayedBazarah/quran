import { IRoleRepository } from "../domain/role-repository";
import { PrismaClient } from "@prisma/client";

export class RolePrismaRepository implements IRoleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    role: Partial<{ id: string; name: string; isDefault: boolean }> & {
      permissions: string[];
    }
  ): Promise<{ id: string; name: string; isDefault: boolean }> {
    if (!role.name) {
      throw new Error("Role name is required");
    }

    if (role.isDefault) {
      const defaultRole = await this.prisma.role.findFirst({
        where: { isDefault: true, NOT: { id: role.id } },
      });
      if (defaultRole) {
        await this.prisma.role.update({
          where: { id: defaultRole.id },
          data: {
            isDefault: false,
          },
        });
      }
    }

    const createdRole = await this.prisma.role.create({
      data: {
        name: role.name,
        isDefault: role.isDefault ?? false,
        permissions: {
          connect: (role.permissions ?? []).map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return {
      id: createdRole.id,
      name: createdRole.name,
      isDefault: createdRole.isDefault,
    };
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findAll(): Promise<{ id: string; name: string; isDefault: boolean }[]> {
    return new Promise((resolve, reject) => {
      this.prisma.role
        .findMany({
          include: {
            permissions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
        .then((roles) => {
          if (roles) {
            resolve(roles);
          } else {
            reject(new Error("Roles not found"));
          }
        });
    });
  }
  getPermissions(): Promise<{ id: string; code: string; name: string }[]> {
    return new Promise((resolve, reject) => {
      this.prisma.permission.findMany().then((permissions) => {
        if (permissions) {
          resolve(permissions);
        } else {
          reject(new Error("Permissions not found"));
        }
      });
    });
  }
  async update(
    role: Partial<{
      id: string;
      name: string;
      isDefault: boolean;
      permissions: string[];
    }>
  ): Promise<{ id: string; name: string; isDefault: boolean }> {
    if (role.isDefault) {
      return await this.prisma.$transaction(async (tx) => {
        // Find the current default role (excluding the one being updated)
        const defaultRole = await tx.role.findFirst({
          where: { isDefault: true, NOT: { id: role.id } },
        });

        // Step 1: Remove default from the old default role (if it exists)
        if (defaultRole) {
          await tx.role.update({
            where: { id: defaultRole.id },
            data: { isDefault: false },
          });
        }

        // Step 2: Update the new default role
        const updatedRole = await tx.role.update({
          where: { id: role.id },
          data: {
            name: role.name,
            isDefault: true,
            ...(role.permissions && {
              permissions: {
                set: role.permissions.map((id) => ({ id })), // set replaces all permissions
              },
            }),
          },
          include: {
            permissions: true,
          },
        });

        return {
          id: updatedRole.id,
          name: updatedRole.name,
          isDefault: updatedRole.isDefault,
        };
      });
    } else {
      // If not setting as default, just update normally
      const updatedRole = await this.prisma.role.update({
        where: { id: role.id },
        data: {
          name: role.name,
          isDefault: role.isDefault,
          ...(role.permissions && {
            permissions: {
              set: role.permissions.map((id) => ({ id })),
            },
          }),
        },
        include: {
          permissions: true,
        },
      });

      return {
        id: updatedRole.id,
        name: updatedRole.name,
        isDefault: updatedRole.isDefault,
      };
    }
  }
}
