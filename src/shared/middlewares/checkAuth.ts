import type { Request,Response,NextFunction } from "express";
import type { UserRole } from "../../../generated/prisma/enums";

export const checkAuth = (...authRoles: UserRole[]) => async (req: Request,res: Response,next: NextFunction) => {
    
}