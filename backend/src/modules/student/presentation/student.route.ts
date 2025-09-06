import { Router } from "express";
import * as validators from "./validators";
import { AdminController } from "./student.controller";
import { globalUploadMiddleware } from "@/shared/middlewares";

const router = Router();
const adminController = new AdminController();

// Local login
router.post(
  "/create",
  globalUploadMiddleware().fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "nationalIdImg",
      maxCount: 1,
    },
  ]),
  validators.createStudentValidator,
  adminController.create
);
router.patch(
  "/parent",
  globalUploadMiddleware().single("nationalIdImg"),
  validators.createUpdateParentValidator,
  adminController.createParent
);

router.get("/details/:id", adminController.details);
router.get("/list", adminController.list);
router.patch(
  "/update/:id",
  globalUploadMiddleware().single("avatar"),
  validators.updateStudentValidator,
  adminController.update
);

// Enrollment
router.post(
  "/enrollment/create/:id",
  validators.createEnrollmentValidator,
  adminController.createEnrollment
);

export default router;
