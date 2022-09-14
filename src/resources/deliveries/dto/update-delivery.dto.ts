import { IsEnum, IsString } from "class-validator";
import { DELIVERY_STATUS_ENUM } from "../../../common/enums";

/**
 * Delivery 수정 시 request body 구조
 */
export class UpdateDeliveryDto {
  @IsEnum(DELIVERY_STATUS_ENUM)
  status: DELIVERY_STATUS_ENUM;
}

/**
 * Delivery 수정 시 response 구조
 */
export class UpdateDeliveryResponseDto {
  @IsString()
  message: string;
}
