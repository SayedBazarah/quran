import { Router } from "express";
import * as validators from "./validators";
import { BranchController } from "./branch.controller";

const router = Router();
const branchController = new BranchController();

// Local login
router.post(
  "/create",
  validators.createBranchValidator,
  branchController.create
);
router.patch(
  "/update/:id",
  validators.updateBranchValidator,
  branchController.update
);
router.delete(
  "/delete/:id",
  validators.deleteBranchValidator,
  branchController.delete
);
router.get("/list", branchController.list);

export default router;
