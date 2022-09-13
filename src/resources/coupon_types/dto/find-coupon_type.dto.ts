import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { COUPONE_TYPE_ENUM } from "src/common/enums";

export class FindCouponTypeDto {
  @IsOptional()
  @IsEnum(COUPONE_TYPE_ENUM)
  type: COUPONE_TYPE_ENUM;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}
