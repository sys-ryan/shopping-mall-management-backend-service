import { IsString } from "class-validator";

export class DeleteOrderResponseDto {
  @IsString()
  message: string;
}
