import type { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/async-handler.util";
import HttpStatus from "../../shared/utils/http-status";
import { ResponseUtil } from "../../shared/utils/response.util";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await SpecialtyService.createSpecialty(payload);
  return ResponseUtil.success(
    res,
    result,
    "Specialty created successfully",
    HttpStatus.CREATED,
  );
});

export const SpecialtyController = {
    createSpecialty
}
