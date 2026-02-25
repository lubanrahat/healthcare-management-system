import type { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/async-handler.util";
import HttpStatus from "../../shared/utils/http-status";
import { ResponseUtil } from "../../shared/utils/response.util";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    icon: req.file?.path,
  };
  const result = await SpecialtyService.createSpecialty(payload);
  return ResponseUtil.success(
    res,
    result,
    "Specialty created successfully",
    HttpStatus.CREATED,
  );
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtyService.getAllSpecialties();
  return ResponseUtil.success(
    res,
    result,
    "Specialties fetched successfully",
    HttpStatus.OK,
  );
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialtyService.deleteSpecialty(id as string);
  return ResponseUtil.success(
    res,
    result,
    "Specialty deleted successfully",
    HttpStatus.OK,
  );
});

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
};
