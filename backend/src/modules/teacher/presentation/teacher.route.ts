import { Router } from "express";
import * as validators from "./validators";
import { TeacherController } from "./teacher.controller";
import { globalUploadMiddleware } from "@/shared/middlewares";

const router = Router();
const teacherController = new TeacherController();

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
  validators.createTeacherValidator,
  teacherController.create
);

router.get("/list", teacherController.list);
router.patch(
  "/update/:id",
  globalUploadMiddleware().single("avatar"),
  validators.updateTeacherValidator,
  teacherController.update
);
router.delete(
  "/delete/:id",
  validators.deleteTeacherValidator,
  teacherController.delete
);

export default router;
