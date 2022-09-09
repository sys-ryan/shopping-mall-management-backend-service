import { PartialType } from '@nestjs/swagger';
import { CreateCouponeDto } from './create-coupone.dto';

export class UpdateCouponeDto extends PartialType(CreateCouponeDto) {}
