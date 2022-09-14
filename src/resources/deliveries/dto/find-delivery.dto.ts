import { IsEnum, IsOptional } from "class-validator";
import { DELIVERY_STATUS_ENUM } from "../../../common/enums";

export class FindDeliveryDto {
  @IsOptional()
  @IsEnum(DELIVERY_STATUS_ENUM)
  status: DELIVERY_STATUS_ENUM;
}
