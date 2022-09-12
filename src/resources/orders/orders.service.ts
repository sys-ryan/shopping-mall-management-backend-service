import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CountriesService } from "../countries/countries.service";
import { Users } from "../users/entities/users.entity";
import { UsersService } from "../users/users.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Orders } from "./entities/orders.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private usersService: UsersService,
    private countriesService: CountriesService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { quantity, originalPrice, buyrZipx, buyrCity, vccode } = createOrderDto;
    const user = await this.usersService.findOneById(createOrderDto.userId);
    const country = await this.countriesService.findOneByCountryCode(createOrderDto.countryCode);

    // TODO : coupon

    const newOrder = await this.ordersRepository.create({
      user,
      country,
      // TODO: coupon
      quantity,
      originalPrice,
      buyrZipx,
      buyrCity,
      vccode,
    });

    await this.ordersRepository.save(newOrder);

    return {
      message: "The order was successfully created.",
    };
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
