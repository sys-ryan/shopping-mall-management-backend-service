import { Module } from "@nestjs/common";
import { DeliveriesService } from "./deliveries.service";
import { DeliveriesController } from "./deliveries.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Deliveries } from "./entities/deliveries.entity";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [TypeOrmModule.forFeature([Deliveries]), OrdersModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
