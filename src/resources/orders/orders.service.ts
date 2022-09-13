import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { COUPONE_TYPE_ENUM, PAY_STATE_ENUM } from "src/common/enums";
import { Between, FindOptionsWhere, Like, Repository } from "typeorm";
import { CountriesService } from "../countries/countries.service";
import { CouponsService } from "../coupons/coupons.service";
import { Coupons } from "../coupons/entities/coupons.entity";
import { DeliveryCostsService } from "../delivery_costs/delivery_costs.service";
import { UsersService } from "../users/users.service";
import { CreateOrderDto, CreateOrderResponseDto } from "./dto/create-order.dto";
import { DeleteOrderResponseDto } from "./dto/delete-order.dto";
import { FindOrdersDto } from "./dto/find-orders.dto";
import { UpdateOrderDto, UpdateOrderResponseDto } from "./dto/update-order.dto";
import { Orders } from "./entities/orders.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private usersService: UsersService,
    private countriesService: CountriesService,
    private couponsService: CouponsService,
    private deliveryCostsService: DeliveryCostsService
  ) {}

  /**
   * 새로운 Order를 생성합니다.
   * 쿠폰 적용시 가격할인일 경우 원래 가격(originalPrice), 할인액(discountedPrice), 할인후 가격(finalPrice) 을 계산하고,
   * 배송비 할인일 경우 원래 배송비(originalDeliveryCost), 배송비 할인액(discountedDeliveryCost), 할인 후 배송비(finalDeliveryCost)를 계산합니다.
   * 마지막으로 가격/배송비 할인 쿠폰이 적용된 상태의 fianlPrice + finalDeliveryCost 를 계산하여 주문자가 최종적으로 지불해야 할 totalPrice를 계산하여 저장합니다.
   * @param createOrderDto Order 생성시 필요한 request body 내용
   * @returns { message: "The order was successfully created.", }
   */
  async create(createOrderDto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    const { quantity, originalPrice, buyrZipx, buyrCity, vccode, couponCode } = createOrderDto;
    const user = await this.usersService.findOneById(createOrderDto.userId);
    const country = await this.countriesService.findOneByCountryCode(createOrderDto.countryCode);

    // coupon
    let coupon: Coupons;
    if (couponCode) {
      coupon = await this.couponsService.findOneByCouponCode(couponCode);

      // coupon 사용 여부 체크 및 사용 처리
      await this.couponsService.useCoupon(couponCode);
    }

    // 배송비 계산 (쿠폰이 있다면 적용)
    // TODO: KR 이 아닌 경우 환율 처리
    // TODO: 환율 API 로 환율 받아오기
    const USD_KRW = 1200;

    const deliveryCost = await this.deliveryCostsService.findOne(country.countryCode, quantity);

    let originalDeliveryCost = deliveryCost.cost;
    let discountedDeliveryCost = 0;

    // KR이 아닌 경우 환율 반영
    if (country.countryCode !== "KR") {
      originalDeliveryCost = +(originalDeliveryCost / USD_KRW).toFixed(2);
    }

    if (coupon?.couponType.type === COUPONE_TYPE_ENUM.SHIPPING_FEE) {
      discountedDeliveryCost = originalDeliveryCost;
    }

    const finalDeliveryCost = originalDeliveryCost - discountedDeliveryCost;

    // 상품 가격 계산 (쿠폰이 있다면 적용)
    let discountedPrice = 0;

    // 정액 할인 쿠폰일 경우 처리
    if (coupon?.couponType.type === COUPONE_TYPE_ENUM.FIXED_VALUE) {
      discountedPrice = coupon.couponType.discountValue;
    }

    // % 할인 쿠폰일 경우 처리
    if (coupon?.couponType.type === COUPONE_TYPE_ENUM.PERCENTAGE) {
      discountedPrice = +(originalPrice * (coupon.couponType.discountValue / 100.0)).toFixed(2);
    }

    const finalPrice = +(originalPrice - discountedPrice).toFixed(2);

    const totalPrice = finalPrice + finalDeliveryCost;

    const newOrder = await this.ordersRepository.create({
      user,
      country,
      quantity,
      // coupon
      coupon,
      originalPrice,
      discountedPrice,
      finalPrice,
      originalDeliveryCost,
      discountedDeliveryCost,
      finalDeliveryCost,
      totalPrice,
      buyrZipx,
      buyrCity,
      vccode,
    });

    await this.ordersRepository.save(newOrder);

    // 쿠폰에 실제 할인 가격 정보 set
    // 추후에 coupon-types에서 쿠폰 총 할인액을 구하기 위해 유지
    if (discountedPrice !== 0) {
      await this.couponsService.setDiscountAmount(coupon.id, discountedPrice);
    } else if (discountedDeliveryCost !== 0) {
      await this.couponsService.setDiscountAmount(coupon.id, discountedDeliveryCost);
    }

    return {
      message: "The order was successfully created.",
    };
  }

  /**
   * 모든 Orders를 조회합니다. 필요할 경우, filters에 payState, buyrName, buyrCity, startDate & endDate 조건을 걸어 검색할 수 있습니다.
   * @param filters Orders 조회 시 필터링할 데이터
   * @returns 주문 목록
   */
  async findAll(filters: FindOrdersDto): Promise<Orders[]> {
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
      relations: ["user", "country", "delivery"],
    });
    return orders;
  }

  async findOneById(id: number): Promise<Orders> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    return order;
  }

  /**
   * 주문 상태를 수정합니다. (in_progress, completed, canceled)
   * @param id Order id
   * @param updateOrderDto 주문 상태를 수정하기위한 request body DTO
   * @returns { message }
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<UpdateOrderResponseDto> {
    const { status } = updateOrderDto;
    const order = await this.findOneById(id);

    order.payState = status;

    await this.ordersRepository.save(order);

    return {
      message: `Order(id: ${id}) was successfully updated.`,
    };
  }

  /**
   * 주문을 삭제합니다.
   * @param id Order id
   * @returns { message }
   */
  async remove(id: number): Promise<DeleteOrderResponseDto> {
    const order = await this.findOneById(id);

    await this.ordersRepository.remove(order);

    return {
      message: `Order(id: ${id}) was successfully deleted.`,
    };
  }
}
