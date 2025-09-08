import { Router } from "express";

import authRoutes from "@/modules/auth/presentation/auth.routes";
import adminRoutes from "@/modules/admin/presentation/admin.route";
import branchRoutes from "@/modules/branch/presentation/branch.route";
import courseRoutes from "@/modules/courses/presentation/course.route";
import roleRoutes from "@/modules/role/presentation/role.route";
import studentRoutes from "@/modules/student/presentation/student.route";
import teachereRoutes from "@/modules/teacher/presentation/teacher.route";
import { accessTokenGuard } from "./guards/isAuthenticated";

const router = Router();

router.use("/admin", accessTokenGuard, adminRoutes);
router.use("/auth", authRoutes);
router.use("/branch", accessTokenGuard, branchRoutes);
router.use("/course", accessTokenGuard, courseRoutes);
router.use("/role", accessTokenGuard, roleRoutes);
router.use("/student", accessTokenGuard, studentRoutes);
router.use("/teacher", accessTokenGuard, teachereRoutes);

// Health check
router.get("/check-health", accessTokenGuard, (req, res) => {
  res.json({ message: "OK" });
});

export default router;
