import { Module } from "@nestjs/common";
import { DeliveryCostsService } from "./delivery_costs.service";
import { DeliveryCostsController } from "./delivery_costs.controller";

@Module({
  controllers: [DeliveryCostsController],
  providers: [DeliveryCostsService],
})
export class DeliveryCostsModule {}
