import { prisma } from "@/shared/prisma/client";
import passport from "passport";
import { localStrategy } from "./strategies/local.strategy";

// Initialize passport
passport.use(localStrategy);

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        branch: true,
      },
    });
    if (admin) {
      // Ensure email is a string, not null
      const user = {
        ...admin,
        email: admin.email ?? "",
      };
      done(null, user);
    } else {
      done(null, null);
    }
  } catch (err) {
    done(err);
  }
});

export default passport;
