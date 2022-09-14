import { IsString } from "class-validator";

/**
 * User 생성을 위한 request body 구조
 */
export class CreateUserDto {
  @IsString()
  name: string;
}

/**
 * User 생성 response 구조
 */
export class CreateUserResponseDto {
  @IsString()
  message: string;
}
