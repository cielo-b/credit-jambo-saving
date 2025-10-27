import { Request, Response, NextFunction } from "express";
import { validateDto, formatValidationErrors } from "../utils/validator";

/**
 * Validate request body against DTO
 */
export const validateBody = <T extends object>(dtoClass: new () => T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const errors = await validateDto(dtoClass, req.body);

    if (errors.length > 0) {
      const formatted = formatValidationErrors(errors);
      res.status(400).json({
        error: "Validation failed",
        details: formatted,
      });
      return;
    }

    next();
  };
};

/**
 * Validate request query against DTO
 */
export const validateQuery = <T extends object>(dtoClass: new () => T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const errors = await validateDto(dtoClass, req.query);

    if (errors.length > 0) {
      const formatted = formatValidationErrors(errors);
      res.status(400).json({
        error: "Validation failed",
        details: formatted,
      });
      return;
    }

    next();
  };
};
