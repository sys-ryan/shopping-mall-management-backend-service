import { IsEnum } from "class-validator";
import { PAY_STATE_ENUM } from "src/common/enums";

export class UpdateOrderDto {
  @IsEnum(PAY_STATE_ENUM)
  status: PAY_STATE_ENUM;
}
