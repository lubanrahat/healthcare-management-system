import type { Request, Response, NextFunction } from "express";
import { UserStatus, type UserRole } from "../../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import AppError from "../errors/app-error";
import HttpStatus from "../utils/http-status";
import ErrorCodes from "../errors/error-codes";
import { prisma } from "../../lib/prisma";
import { logger } from "../logger/logger";
import { jwtUtils } from "../utils/jwt";
import { config } from "../../config/env";

export const checkAuth =
  (...authRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(
          "Unauthorized access! No session token provided.",
          HttpStatus.NOT_FOUND,
          ErrorCodes.NOT_FOUND,
        );
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());

            logger.info("Session Expiring Soon!!");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              "Unauthorized access! User is not active.",
              HttpStatus.UNAUTHORIZED,
              ErrorCodes.UNAUTHORIZED,
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              "Unauthorized access! User is deleted.",
              HttpStatus.UNAUTHORIZED,
              ErrorCodes.UNAUTHORIZED,
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              "Forbidden access! You do not have permission to access this resource.",
              HttpStatus.FORBIDDEN,
              ErrorCodes.FORBIDDEN,
            );
          }

          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
        const accessToken = CookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
          throw new AppError(
            "Unauthorized access! No access token provided.",
            HttpStatus.UNAUTHORIZED,
            ErrorCodes.UNAUTHORIZED,
          );
        }
      }

      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          "Unauth  orized access! No access token provided.",
          HttpStatus.UNAUTHORIZED,
          ErrorCodes.UNAUTHORIZED,
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        config.jwt.accessTokenSecret,
      );
      if (!verifiedToken.success) {
        throw new AppError(
          "Unauthorized access! Invalid access token.",
          HttpStatus.UNAUTHORIZED,
          ErrorCodes.UNAUTHORIZED,
        );
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.role as UserRole)
      ) {
        throw new AppError(
          "Forbidden access! You do not have permission to access this resource.",
          HttpStatus.FORBIDDEN,
          ErrorCodes.FORBIDDEN,
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
