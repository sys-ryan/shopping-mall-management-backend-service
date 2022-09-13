import { Transform } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";
import { getDateFromString } from "src/resources/orders/dto/find-orders.dto";

export class CreateCouponDto {
  @IsNumber()
  couponTypeId: number;

  @IsDate()
  @Transform(({ value }) => getDateFromString(value), { toClassOnly: true })
  expiresAt: Date;
}
