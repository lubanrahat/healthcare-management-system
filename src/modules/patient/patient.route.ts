import express, { type Router } from "express";
import { validateRequest } from "../../shared/middlewares/validate.middleware";
import { checkAuth } from "../../shared/middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { updateMyPatientProfileMiddleware } from "./patient.middlewares";
import { PatientValidation } from "./patient.validation";
import { PatientController } from "./patient.controller";
import { multerUpload } from "../../config/multer.config";

export default function registerAuthRoutes(): Router {
  const router = express.Router();

  router.patch(
    "/update-my-profile",
    checkAuth(UserRole.PATIENT),
    multerUpload.fields([
      { name: "profilePhoto", maxCount: 1 },
      { name: "medicalReports", maxCount: 5 },
    ]),
    updateMyPatientProfileMiddleware,
    validateRequest({ body: PatientValidation.updatePatientProfileZodSchema }),
    PatientController.updateMyProfile,
  );

  return router;
}
