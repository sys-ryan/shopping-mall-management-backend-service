import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

/**
 * Order 생성 시 request body validation을 위한 DTO 입니다.
 */
export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(2)
  countryCode: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsString()
  @IsNotEmpty()
  buyrZipx: string;

  @IsString()
  @IsNotEmpty()
  buyrCity: string;

  @IsNumber()
  vccode: number;

  @IsOptional()
  @IsString()
  couponCode: string;
}

export class CreateOrderResponseDto {
  @IsString()
  message: string;
}
