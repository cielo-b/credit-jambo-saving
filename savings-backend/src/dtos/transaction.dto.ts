import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  Min,
} from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class TransactionQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  type?: "deposit" | "withdrawal";
}
