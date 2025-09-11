import { hash } from "../auth/hashing";
import { prisma } from "../prisma/client";
import { createMediaFolders } from "../utils/file";
import { ensureGlobalPermissions } from "./global-permissions";

export async function createGobalStaticData() {
  await createMainBranch();
  await ensureGlobalPermissions();
  await createMediaFolders();
  await createMainAdmin();
}

async function createMainBranch() {
  const exists = await prisma.branch.findFirst({
    where: { name: "رئيسي" },
  });
  if (!exists) {
    await prisma.branch.create({
      data: { name: "رئيسي" },
    });
  }
}
async function createMainAdmin() {
  const exists = await prisma.admin.findFirst({
    where: { username: "admin" },
  });

  if (!exists) {
    const permissions = await prisma.permission.findMany({
      select: { id: true },
    });

    const role = await prisma.role.create({
      data: {
        name: "مدير النظام",
        isDefault: true,
        permissions: {
          connect: permissions.map((p) => ({ id: p.id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    await prisma.admin.create({
      data: {
        username: "admin",
        password: await hash("123456"),
        email: "admin@admin.com",
        name: "المدير الرئيسي",
        phone: "1234567890",
        nationalId: "12345678901234",
        nationalIdImg: "https://via.placeholder.com/150",
        avatar: "https://via.placeholder.com/150",
        gender: "admin",
        role: { connect: { id: role.id } },
      },
    });
  }
}
