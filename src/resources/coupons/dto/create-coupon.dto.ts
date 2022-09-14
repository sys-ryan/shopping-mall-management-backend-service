import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import { getDateFromString } from "../../../resources/orders/dto/find-orders.dto";

/**
 * 쿠폰 발급을 위한 request body DTO
 */
export class CreateCouponDto {
  @IsNumber()
  couponTypeId: number;

  @IsDate()
  @Transform(({ value }) => getDateFromString(value), { toClassOnly: true })
  expiresAt: Date;
}

/**
 * 쿠폰 발급에 대한 response body DTO
 */
export class CreateCouponResponseDto {
  @IsString()
  message: string;

  @IsString()
  couponCode: string;

  @IsDate()
  expiresAt: Date;
}
