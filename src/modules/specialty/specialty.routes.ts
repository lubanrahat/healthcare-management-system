import express, { type Router } from "express";
import { validateRequest } from "../../shared/middlewares/validate.middleware";
import { SpecialtyValidation } from "./specialty.validation";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../shared/middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";


export default function registerSpecialtyRoutes(): Router {
  const router = express.Router();
  router.post(
    "/",
    // checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest({ body: SpecialtyValidation.createSpecialtyZodSchema }),
    SpecialtyController.createSpecialty
  );
  
  return router;
}
