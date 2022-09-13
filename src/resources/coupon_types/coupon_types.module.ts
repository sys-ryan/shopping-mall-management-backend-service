import { Module } from "@nestjs/common";
import { CouponTypesService } from "./coupon_types.service";
import { CouponTypesController } from "./coupon_types.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CouponTypes } from "./entities/coupon_types.entity";
import { Coupons } from "../coupons/entities/coupons.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CouponTypes, Coupons])],
  controllers: [CouponTypesController],
  providers: [CouponTypesService],
  exports: [CouponTypesService],
})
export class CouponTypesModule {}
