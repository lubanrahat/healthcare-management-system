import type { Request, Response } from "express";
import type { IRequestUser } from "../../shared/interfaces/requestUser.interface";
import { catchAsync } from "../../shared/utils/async-handler.util";
import { PatientService } from "./patient.service";
import { ResponseUtil } from "../../shared/utils/response.util";
import HttpStatus from "../../shared/utils/http-status";

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const payload = req.body;

  const result = await PatientService.updateMyProfile(user, payload);

  ResponseUtil.success(
    res,
    result,
    "Profile updated successfully",
    HttpStatus.OK,
  );
});

export const PatientController = {
  updateMyProfile,
};
