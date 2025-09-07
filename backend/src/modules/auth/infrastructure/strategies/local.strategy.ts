import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "@/shared/prisma/client";
import { compare } from "@/shared/auth/hashing";

export const localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    console.log("username, password");
    console.log(username, password);
    const admin = await prisma.admin.findUnique({
      where: { username },
      include: {
        role: true,
        branch: true,
      },
    });
    console.log("admin");
    console.log(admin);
    if (!admin || !(await compare(password, `${admin.password}`))) {
      return done(null, false, { message: "Invalid credentials" });
    }
    return done(null, { ...admin, email: admin.email ?? "" });
  }
);
