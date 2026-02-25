import winston from "winston";
import { config } from "../../config/env";

const { combine, timestamp, errors, printf, json, colorize } = winston.format;

const isProduction = config.app.nodeEnv === "production";

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `${timestamp} [${level}]: ${stack || message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ""
  }`;
});

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    isProduction ? json() : logFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: isProduction ? json() : combine(colorize(), logFormat),
    }),
  ],
});