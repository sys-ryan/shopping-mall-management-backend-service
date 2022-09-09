import { Module } from '@nestjs/common';
import { CouponTypesService } from './coupon_types.service';
import { CouponTypesController } from './coupon_types.controller';

@Module({
  controllers: [CouponTypesController],
  providers: [CouponTypesService]
})
export class CouponTypesModule {}
