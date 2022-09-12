import { IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(2)
  countryCode: string;

  // TODO: couponId

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
}
