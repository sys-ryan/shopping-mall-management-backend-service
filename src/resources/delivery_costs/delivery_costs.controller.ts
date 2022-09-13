import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { DeliveryCostsService } from "./delivery_costs.service";
import { CreateDeliveryCostDto } from "./dto/create-delivery_cost.dto";
import { UpdateDeliveryCostDto } from "./dto/update-delivery_cost.dto";

@Controller("delivery-costs")
export class DeliveryCostsController {
  constructor(private readonly deliveryCostsService: DeliveryCostsService) {}

  @Post()
  create(@Body() createDeliveryCostDto: CreateDeliveryCostDto) {
    return this.deliveryCostsService.create(createDeliveryCostDto);
  }

  @Get()
  findAll() {
    return this.deliveryCostsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.deliveryCostsService.findOne(+id);
  // }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDeliveryCostDto: UpdateDeliveryCostDto) {
    return this.deliveryCostsService.update(+id, updateDeliveryCostDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deliveryCostsService.remove(+id);
  }
}
