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

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/branch", branchRoutes);
router.use("/course", courseRoutes);
router.use("/role", roleRoutes);
router.use("/student", studentRoutes);
router.use("/teacher", teachereRoutes);

// Health check
router.get("/check-health", accessTokenGuard, (req, res) => {
  res.json({ message: "OK" });
});

export default router;
