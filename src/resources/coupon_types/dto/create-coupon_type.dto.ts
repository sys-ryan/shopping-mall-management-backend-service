import { IsEnum, IsNumber, IsString, Min } from "class-validator";
import { COUPONE_TYPE_ENUM } from "src/common/enums";

export class CreateCouponTypeDto {
  @IsString()
  name: string;

  @IsEnum(COUPONE_TYPE_ENUM)
  type: COUPONE_TYPE_ENUM;

  @IsNumber()
  @Min(0)
  discountValue: number;
}

export class CreateCouponTypeResponseDto {
  @IsString()
  message: string;
}
