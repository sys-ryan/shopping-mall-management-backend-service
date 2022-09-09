import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Countries } from "../countries/entities/countries.entity";
import { CreateDeliveryCostDto } from "./dto/create-delivery_cost.dto";
import { UpdateDeliveryCostDto } from "./dto/update-delivery_cost.dto";
import { DeliveryCosts } from "./entities/delivery_costs.entity";

@Injectable()
export class DeliveryCostsService {
  create(createDeliveryCostDto: CreateDeliveryCostDto) {
    return "This action adds a new deliveryCost";
  }

  findAll() {
    return `This action returns all deliveryCosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryCost`;
  }

  update(id: number, updateDeliveryCostDto: UpdateDeliveryCostDto) {
    return `This action updates a #${id} deliveryCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryCost`;
  }
}
