import { Module } from "@nestjs/common";
import { DeliveryCostsService } from "./delivery_costs.service";
import { DeliveryCostsController } from "./delivery_costs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryCosts } from "./entities/delivery_costs.entity";
import { CountriesModule } from "../countries/countries.module";
import { OrdersModule } from "../orders/orders.module";
import { Orders } from "../orders/entities/orders.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryCosts, Orders]), CountriesModule],
  controllers: [DeliveryCostsController],
  providers: [DeliveryCostsService],
  exports: [DeliveryCostsService],
})
export class DeliveryCostsModule {}
