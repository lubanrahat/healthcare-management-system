import type { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/async-handler.util";
import { ResponseUtil } from "../../shared/utils/response.util";
import HttpStatus from "../../shared/utils/http-status";

const handleHealthCheck = catchAsync(async (req: Request, res: Response) => {
  return ResponseUtil.success(
    res,
    { health: "OK", version: "1.0.0" },
    "Health check successful",
    HttpStatus.OK,
  );
});

export const HealthController = {
  handleHealthCheck,
};
