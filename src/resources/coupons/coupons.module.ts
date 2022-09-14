import { Module } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CouponsController } from "./coupons.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupons } from "./entities/coupons.entity";
import { CouponTypesModule } from "../coupon_types/coupon_types.module";
import { DeliveryCostsModule } from "../delivery_costs/delivery_costs.module";
import { Orders } from "../orders/entities/orders.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Coupons, Orders]), CouponTypesModule, DeliveryCostsModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
