import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { body, param } from "express-validator";

export const createEnrollmentLogValidator = [
  param("id").isString().withMessage("courseId must be a string"),
  body("enrollmentId").isString().withMessage("adminId must be a string"),
  body("note").isString().withMessage("adminId must be a string"),
  globalValidatorMiddleware,
];
