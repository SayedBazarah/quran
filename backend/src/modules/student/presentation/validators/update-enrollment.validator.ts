import { globalValidatorMiddleware } from "@/shared/middlewares/global-validator.middleware";
import { body, param } from "express-validator";

export const updateEnrollmentValidator = [
  param("id").isString().withMessage("id is invalid"),
  body("status").optional().isString().withMessage("Status is invalid"),
  body("teacherId").optional().isString().withMessage("teacherId is invalid"),
  body("adminId").optional().isString().withMessage("adminId is invalid"),
  globalValidatorMiddleware,
];
