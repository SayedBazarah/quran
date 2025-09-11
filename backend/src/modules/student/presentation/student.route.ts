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
router.get("/enrollment/pending", adminController.pendingEnrollments);
router.post(
  "/enrollment/accept/:id",
  validators.acceptEnrollmentValidator,
  adminController.acceptEnrollment
);
router.post(
  "/enrollment/create/:id",
  validators.createEnrollmentValidator,
  adminController.createEnrollment
);
router.post(
  "/enrollment/log/:id",

  validators.createEnrollmentLogValidator,
  adminController.createEnrollmentLog
);
router.post(
  "/enrollment/close/:id",

  validators.closeEnrollmentValidator,
  adminController.closeEnrollment
);
router.patch(
  "/enrollment/update/:id",
  validators.updateEnrollmentValidator,
  adminController.updateEnrollment
);

export default router;
