import { globalValidatorMiddleware } from "@/shared/middlewares";
import { body } from "express-validator";

export const closeEnrollmentValidator = [
  body("enrollmentId").isString().withMessage("الدورة غير صحيحة"),
  globalValidatorMiddleware,
];
