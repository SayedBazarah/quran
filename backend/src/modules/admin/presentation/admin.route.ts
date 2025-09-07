import { Router } from "express";
import * as validators from "./validators";
import { AdminController } from "./admin.controller";
import { globalUploadMiddleware } from "@/shared/middlewares";

const router = Router();
const adminController = new AdminController();

// Local login
router.post(
  "/create",
  // accept (avatar, nationalIdImg)
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
  validators.createAdminValidator,
  adminController.create
);

router.get("/list", adminController.list);
router.patch(
  "/update/:id",
  globalUploadMiddleware().single("avatar"),
  adminController.update
);
router.delete("/delete/:id", adminController.delete);

export default router;
