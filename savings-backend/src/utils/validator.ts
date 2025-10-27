import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";

/**
 * Validate DTO
 * @param dtoClass - DTO class
 * @param data - Data to validate
 * @returns Validation errors
 */
export const validateDto = async <T extends object>(
  dtoClass: new () => T,
  data: any
): Promise<ValidationError[]> => {
  const dto = plainToClass(dtoClass, data);
  return await validate(dto);
};

/**
 * Format validation errors
 * @param errors - Validation errors
 * @returns Formatted error messages
 */
export const formatValidationErrors = (
  errors: ValidationError[]
): Record<string, string[]> => {
  const formatted: Record<string, string[]> = {};

  errors.forEach((error) => {
    if (error.constraints) {
      formatted[error.property] = Object.values(error.constraints);
    }
  });

  return formatted;
};
