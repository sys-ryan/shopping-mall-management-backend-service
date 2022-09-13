import { Module } from "@nestjs/common";
import { CouponTypesService } from "./coupon_types.service";
import { CouponTypesController } from "./coupon_types.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CouponTypes } from "./entities/coupon_types.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CouponTypes])],
  controllers: [CouponTypesController],
  providers: [CouponTypesService],
})
export class CouponTypesModule {}
