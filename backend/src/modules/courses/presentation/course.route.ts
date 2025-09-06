import { Router } from "express";
import * as validators from "./validators";
import { CourseController } from "./course.controller";

const router = Router();
const courseController = new CourseController();

// Local login
router.post(
  "/create",
  validators.createCourseValidator,
  courseController.create
);

router.get("/list", courseController.list);
router.patch("/update/:id", courseController.update);
router.delete("/delete/:id", courseController.delete);

export default router;
