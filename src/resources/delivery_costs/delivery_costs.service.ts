import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryCosts } from "./entities/delivery_costs.entity";

@Injectable()
export class DeliveryCostsService {
  constructor(
    @InjectRepository(DeliveryCosts) private deliveryCostsRepository: Repository<DeliveryCosts>
  ) {}

  async findOne(countryCode: string, quantity: number) {
    const deliveryCost = await this.deliveryCostsRepository.findOne({
      where: {
        country: { countryCode },
        quantity,
      },
    });

    if (!deliveryCost) {
      throw new NotFoundException("DeliveryCost not found.");
    }

    return deliveryCost;
  }
}
