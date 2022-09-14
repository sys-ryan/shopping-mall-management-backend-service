import { IsEnum, IsString } from "class-validator";
import { PAY_STATE_ENUM } from "../../../common/enums";

/**
 * 주문 상태 변경 request body 구조
 */
export class UpdateOrderDto {
  @IsEnum(PAY_STATE_ENUM)
  status: PAY_STATE_ENUM;
}

/**
 * 주문 상태 변경 response 구조
 */
export class UpdateOrderResponseDto {
  @IsString()
  message: string;
}
