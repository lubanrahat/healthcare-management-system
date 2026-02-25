import express, { type Router } from "express";
import { HealthController } from "./health.controller";

function registerHealthRoutes(): Router {
  const router = express.Router();

  router.get("/", HealthController.handleHealthCheck);

  return router;
}

export default registerHealthRoutes;
