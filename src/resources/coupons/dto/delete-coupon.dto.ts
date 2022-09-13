import { IsString } from "class-validator";

/**
 * 쿠폰 삭제시 resposne 형식
 */
export class DeleteCouponResponseDto {
  @IsString()
  message: string;
}
