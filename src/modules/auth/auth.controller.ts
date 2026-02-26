import type { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/async-handler.util";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../shared/utils/token";
import { ResponseUtil } from "../../shared/utils/response.util";
import HttpStatus from "../../shared/utils/http-status";
import ErrorCodes from "../../shared/errors/error-codes";
import AppError from "../../shared/errors/app-error";
import { logger } from "../../shared/logger/logger";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  return ResponseUtil.success(
    res,
    { token, accessToken, refreshToken, ...rest },
    "Patient registered successfully",
    HttpStatus.CREATED,
  );
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { token, accessToken, refreshToken, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  return ResponseUtil.success(
    res,
    { token, accessToken, refreshToken, ...rest },
    "User logged in successfully",
    HttpStatus.OK,
  );
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  return ResponseUtil.success(
    res,
    result,
    "User profile fetched successfully",
    HttpStatus.OK,
  );
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  if (!refreshToken) {
    throw new AppError(
      "Refresh token is missing",
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.UNAUTHORIZED,
    );
  }

  const result = await AuthService.getNewToken(
    refreshToken,
    betterAuthSessionToken,
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  return ResponseUtil.success(
    res,
    { accessToken, refreshToken: newRefreshToken, sessionToken },
    "New tokens generated successfully",
    HttpStatus.OK,
  );
});

export const AuthController = {
  registerPatient,
  loginUser,
  getMe,
  getNewToken,
};
