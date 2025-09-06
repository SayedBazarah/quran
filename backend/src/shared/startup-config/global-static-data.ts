import { prisma } from "../prisma/client";
import { createMediaFolders } from "../utils/file";
import { ensureGlobalPermissions } from "./global-permissions";

export async function createGobalStaticData() {
  await createMainBranch();
  await ensureGlobalPermissions();
  await createMediaFolders();
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
