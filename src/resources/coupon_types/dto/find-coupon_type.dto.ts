import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { COUPONE_TYPE_ENUM } from "../../../common/enums";
import { Coupons } from "../../../resources/coupons/entities/coupons.entity";

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

/**
 * 쿠폰 타입 조회시 resopnse 구조
 */
export class FindCouponTypeResponseDto {
  id: number;

  name: string;

  type: COUPONE_TYPE_ENUM;

  discountValue: number;

  coupons: Coupons[];

  usedCount: number;

  totalDiscountAmount: number;
}
