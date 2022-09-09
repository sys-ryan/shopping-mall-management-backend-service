import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryCostDto } from './create-delivery_cost.dto';

export class UpdateDeliveryCostDto extends PartialType(CreateDeliveryCostDto) {}
