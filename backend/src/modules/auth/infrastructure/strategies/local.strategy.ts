import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "@/shared/prisma/client";
import { compare } from "@/shared/auth/hashing";

export const localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    const admin = await prisma.admin.findUnique({
      where: { username },
      include: {
        role: true,
        branch: true,
      },
    });

    if (!admin || !(await compare(password, `${admin.password}`))) {
      return done(null, false, {
        message: "اسم المستخدم أو كلمة المرور غير صحيح",
      });
    }

    return done(null, { ...admin, email: admin.email ?? "" });
  }
);
