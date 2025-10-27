import { IsString, IsNotEmpty, IsBoolean, IsOptional } from "class-validator";

export class VerifyDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsBoolean()
  isVerified: boolean;
}

export class UserFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: "createdAt" | "balance" | "email";

  @IsString()
  @IsOptional()
  order?: "ASC" | "DESC";
}
