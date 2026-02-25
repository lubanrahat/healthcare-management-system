import express, { type Router } from "express";
import { validateRequest } from "../../shared/middlewares/validate.middleware";
import { SpecialtyValidation } from "./specialty.validation";
import { SpecialtyController } from "./specialty.controller";


export default function registerSpecialtyRoutes(): Router {
  const router = express.Router();
  router.post(
    "/",
    validateRequest({ body: SpecialtyValidation.createSpecialtyZodSchema }),
    SpecialtyController.createSpecialty
  );
  
  return router;
}
