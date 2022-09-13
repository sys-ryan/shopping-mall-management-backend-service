import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { COUPONE_TYPE_ENUM } from "src/common/enums";
import { Coupons } from "src/resources/coupons/entities/coupons.entity";

/**
 * 쿠폰 유형 목록 조회시 검색 필터
 */
export class FindCouponTypeDto {
  @IsOptional()
  @IsEnum(COUPONE_TYPE_ENUM)
  type: COUPONE_TYPE_ENUM;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class FindCouponTypeResponseDto {
  id: number;

  name: string;

  type: COUPONE_TYPE_ENUM;

  discountValue: number;

  coupons: Coupons[];

  usedCount: number;

  totalDiscountAmount: number;
}
