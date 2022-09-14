import { IsString } from "class-validator";

/**
 * 주문 삭제 response 구조
 */
export class DeleteOrderResponseDto {
  @IsString()
  message: string;
}
