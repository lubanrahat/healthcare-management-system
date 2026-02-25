import express, { type Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../shared/middlewares/validate.middleware";
import { AuthValidation } from "./auth.validation";

export default function registerAuthRoutes(): Router {
  const router = express.Router();
  router.post(
    "/register",
    validateRequest({ body: AuthValidation.registerSchema }),
    AuthController.registerPatient,
  );
  router.post(
    "/login",
    validateRequest({ body: AuthValidation.loginSchema }),
    AuthController.loginUser,
  );
  return router;
}
