import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { IndexRouter } from "./routes";
import cookieParser from "cookie-parser";
import { logger } from "./shared/logger/logger";
import HttpStatus from "./shared/utils/http-status";
import { ResponseUtil } from "./shared/utils/response.util";
import { config } from "./config/env";
import { errorHandler } from "./shared/middlewares/global-error.middleware";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import path from "node:path";

function createApp(): Application {
  const app: Application = express();

  // app.set("query parser", (str: string) => qs.parse(str));

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../src/templates"));

  app.use(
    cors({
      origin: config.frontend.url,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use("/api/auth", toNodeHandler(auth));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/api/v1", IndexRouter);
  //Not found routes
  app.use((req: Request, res: Response) => {
    logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
    ResponseUtil.error(res, "Route not found", HttpStatus.NOT_FOUND);
  });

  app.use(errorHandler);

  return app;
}

export default createApp;
