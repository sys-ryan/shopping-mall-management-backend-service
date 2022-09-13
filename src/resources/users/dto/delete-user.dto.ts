import { IsString } from "class-validator";

/**
 * 유저 삭제 API response 구조
 */
export class DeleteUserResponseDto {
  @IsString()
  message: string;
}
