import express, { type Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../shared/middlewares/validate.middleware";
import { AuthValidation } from "./auth.validation";
import { checkAuth } from "../../shared/middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

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

  router.get(
    "/me",
    checkAuth(
      UserRole.ADMIN,
      UserRole.DOCTOR,
      UserRole.PATIENT,
      UserRole.SUPER_ADMIN,
    ),
    AuthController.getMe,
  );

  router.post("/refresh-token", AuthController.getNewToken);

  router.post(
    "/change-password",
    checkAuth(
      UserRole.ADMIN,
      UserRole.DOCTOR,
      UserRole.PATIENT,
      UserRole.SUPER_ADMIN,
    ),
    AuthController.changePassword,
  );
  
  router.post(
    "/logout",
    checkAuth(
      UserRole.ADMIN,
      UserRole.DOCTOR,
      UserRole.PATIENT,
      UserRole.SUPER_ADMIN,
    ),
    AuthController.logoutUser,
  );

  return router;
}
