import { Module } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CouponsController } from "./coupons.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupons } from "./entities/coupons.entity";
import { CouponTypesModule } from "../coupon_types/coupon_types.module";

@Module({
  imports: [TypeOrmModule.forFeature([Coupons]), CouponTypesModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
