import { IsNumber, IsString } from "class-validator";

/**
 * Delivery 생성 시 request body 구조
 */
export class CreateDeliveryDto {
  @IsNumber()
  orderId: number;
}

/**
 * Delivery 생성 후 response 구조
 */
export class CreateDeliveryResponseDto {
  @IsString()
  message: string;
}
