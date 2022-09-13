import { IsString } from "class-validator";

export class DeleteCouponResponseDto {
  @IsString()
  message: string;
}
