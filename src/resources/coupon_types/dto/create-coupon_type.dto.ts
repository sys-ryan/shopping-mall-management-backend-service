import { IsEnum, IsNumber, IsString, Min } from "class-validator";
import { COUPONE_TYPE_ENUM } from "../../../common/enums";

/**
 * 쿠폰 생성을 위한 request body DTO
 */
export class CreateCouponTypeDto {
  @IsString()
  name: string;

  @IsEnum(COUPONE_TYPE_ENUM)
  type: COUPONE_TYPE_ENUM;

  @IsNumber()
  @Min(0)
  discountValue: number;
}

/**
 * 쿠폰 생성 후 response body 구조
 */
export class CreateCouponTypeResponseDto {
  @IsString()
  message: string;
}
