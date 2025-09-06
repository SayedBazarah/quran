import { IBranchRepository } from "../domain/branch-repository";
import { Branch, PrismaClient } from "@prisma/client";

export class BranchPrismaRepository implements IBranchRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    branch: Partial<Branch> & {
      name: string;
    }
  ): Promise<Branch> {
    const isExist = await this.prisma.branch.findFirst({
      where: { name: branch.name },
    });

    if (isExist) {
      throw new Error("Branch with this name already exists");
    }

    const createdBranch = await this.prisma.branch.create({
      data: {
        name: branch.name,
        phone: branch.phone,
        address: branch.address,
      },
    });

    return createdBranch;
  }

  findAll(): Promise<Branch[]> {
    return new Promise((resolve, reject) => {
      this.prisma.branch
        .findMany({
          include: {
            _count: {
              select: {
                teachers: true,
                students: true,
                admins: true,
              },
            },
          },
        })
        .then((branches) => {
          if (branches) {
            resolve(branches);
          } else {
            reject(new Error("Branches not found"));
          }
        });
    });
  }
  update(branch: Partial<Branch>): Promise<Branch> {
    return new Promise((resolve, reject) => {
      this.prisma.branch
        .update({
          where: { id: branch.id },
          data: branch,
        })
        .then((updatedBranch) => {
          if (updatedBranch) {
            resolve(updatedBranch);
          } else {
            reject(new Error("Branch not found"));
          }
        });
    });
  }
  delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.prisma.branch
        .delete({
          where: { id },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(new Error("Branch not found"));
        });
    });
  }
}
