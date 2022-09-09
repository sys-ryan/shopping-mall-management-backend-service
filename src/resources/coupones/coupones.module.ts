import { Module } from '@nestjs/common';
import { CouponesService } from './coupones.service';
import { CouponesController } from './coupones.controller';

@Module({
  controllers: [CouponesController],
  providers: [CouponesService]
})
export class CouponesModule {}
