import { globalValidatorMiddleware } from "@/shared/middlewares";
import { param } from "express-validator";

export const acceptEnrollmentValidator = [
  param("id").isString().withMessage("رقم الدورة غير صحيح"),
  globalValidatorMiddleware,
];
