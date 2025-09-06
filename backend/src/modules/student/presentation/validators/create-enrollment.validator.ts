import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { body, param } from "express-validator";

export const createEnrollmentValidator = [
  param("id").isString().withMessage("studentId must be a string"),
  body("courseId").isString().withMessage("courseId must be a string"),
  body("adminId").isString().withMessage("adminId must be a string"),
  body("teacherId").isString().withMessage("teacherId must be a string"),
  globalValidatorMiddleware,
];
