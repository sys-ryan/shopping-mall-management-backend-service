import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entities/orders.entity";
import { Users } from "../users/entities/users.entity";
import { UsersModule } from "../users/users.module";
import { CountriesModule } from "../countries/countries.module";
import { DeliveryCostsModule } from "../delivery_costs/delivery_costs.module";
import { CouponsModule } from "../coupons/coupons.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders, Users]),
    UsersModule,
    CountriesModule,
    DeliveryCostsModule,
    CouponsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
