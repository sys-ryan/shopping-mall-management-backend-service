import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CountriesService } from "../countries/countries.service";
import { Countries } from "../countries/entities/countries.entity";
import { OrdersService } from "../orders/orders.service";
import { CreateDeliveryCostDto } from "./dto/create-delivery_cost.dto";
import { UpdateDeliveryCostDto } from "./dto/update-delivery_cost.dto";
import { DeliveryCosts } from "./entities/delivery_costs.entity";

@Injectable()
export class DeliveryCostsService {
  constructor(
    @InjectRepository(DeliveryCosts) private deliveryCostsRepository: Repository<DeliveryCosts>,
    private countriesService: CountriesService
  ) {}

  create(createDeliveryCostDto: CreateDeliveryCostDto) {
    return "This action adds a new deliveryCost";
  }

  findAll() {
    return `This action returns all deliveryCosts`;
  }

  // async findOneByCountryCode(countryCode: string) {
  //   // const country = await this.countriesService.findOneByCountryCode(countryCode);

  //   const deliveryCost = await this.deliveryCostsRepository.findOne({
  //     where: { country: { countryCode } },
  //   });

  //   return deliveryCost;
  // }

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

  update(id: number, updateDeliveryCostDto: UpdateDeliveryCostDto) {
    return `This action updates a #${id} deliveryCost`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryCost`;
  }
}
