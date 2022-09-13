import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { filter } from "rxjs";
import { PAY_STATE_ENUM } from "src/common/enums";
import { Between, FindOptionsWhere, Like, Repository } from "typeorm";
import { CountriesService } from "../countries/countries.service";
import { Users } from "../users/entities/users.entity";
import { UsersService } from "../users/users.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { FindOrdersDto } from "./dto/find-orders.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Orders } from "./entities/orders.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private usersService: UsersService,
    private countriesService: CountriesService
  ) {}

  /**
   * 새로운 Order를 생성합니다.
   * @param createOrderDto Order 생성시 필요한 request body 내용
   * @returns { message: "The order was successfully created.", }
   */
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

  /**
   * 모든 Orders를 조회합니다. 필요할 경우, filters에 payState, buyrName, buyrCity, startDate & endDate 조건을 걸어 검색할 수 있습니다.
   * @param filters Orders 조회 시 필터링할 데이터
   * @returns 주문 목록
   */
  async findAll(filters: FindOrdersDto) {
    if ((filters.startDate && !filters.endDate) || (!filters.startDate && filters.endDate)) {
      throw new BadRequestException("startDate and endDate should be set together");
    }

    const whereOptions: FindOptionsWhere<Orders> = {};

    // filter by pay_state
    if (filters.payState === PAY_STATE_ENUM.CANCELED) {
      whereOptions.payState = PAY_STATE_ENUM.CANCELED;
    } else if (filters.payState === PAY_STATE_ENUM.COMPLETED) {
      whereOptions.payState = PAY_STATE_ENUM.COMPLETED;
    } else if (filters.payState === PAY_STATE_ENUM.IN_PROGRESS) {
      whereOptions.payState = PAY_STATE_ENUM.IN_PROGRESS;
    }

    // filter by buyr_name
    if (filters.buyrName) {
      whereOptions.user = { name: Like(`%${filters.buyrName}%`) };
    }

    // filter by buyr_city
    if (filters.buyrCity) {
      whereOptions.buyrCity = Like(`%${filters.buyrCity}%`);
    }

    // filter by buyr_country
    if (filters.buyrCountry) {
      whereOptions.country = { countryCode: filters.buyrCountry };
    }

    // filter by start/end date
    if (filters.startDate && filters.endDate) {
      filters.endDate.setDate(filters.endDate.getDate() + 1);

      whereOptions.createdAt = Between(filters.startDate, filters.endDate);
    }

    const orders = await this.ordersRepository.find({
      where: whereOptions,
      relations: ["user", "country"],
    });
    return orders;
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
