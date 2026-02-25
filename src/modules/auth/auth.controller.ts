import type { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/async-handler.util";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../shared/utils/token";
import { ResponseUtil } from "../../shared/utils/response.util";
import HttpStatus from "../../shared/utils/http-status";

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

  return ResponseUtil.success(
    res,
    { token, accessToken, refreshToken, ...rest },
    "User logged in successfully",
    HttpStatus.OK,
  );
});

export const AuthController = {
  registerPatient,
  loginUser,
};
