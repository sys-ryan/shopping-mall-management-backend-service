import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CouponTypesService } from "../coupon_types/coupon_types.service";
import { CreateCouponDto, CreateCouponResponseDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { Coupons } from "./entities/coupons.entity";

import { v4 as uuidv4 } from "uuid";
import { COUPONE_TYPE_ENUM } from "src/common/enums";
import { DeliveryCostsService } from "../delivery_costs/delivery_costs.service";
import { Orders } from "../orders/entities/orders.entity";
import { DeleteCouponResponseDto } from "./dto/delete-coupon.dto";

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupons) private couponsRepository: Repository<Coupons>,
    @InjectRepository(Orders) private ordersRepository: Repository<Orders>,
    private couponTypesService: CouponTypesService,
    private deliveryCostsService: DeliveryCostsService
  ) {}

  /**
   * 쿠폰 발급 함수
   * 쿠폰 코드는 uuidv4 를 사용하여 생성
   * @param createCouponDto 쿠폰 발급을 위한 request body DTO
   * @returns 쿠폰 코드와 만료 시간을 반환. { MessageChannel, couponCode, expiresAt }
   */
  async create(createCouponDto: CreateCouponDto): Promise<CreateCouponResponseDto> {
    const { couponTypeId, expiresAt } = createCouponDto;

    const couponType = await this.couponTypesService.findOneById(couponTypeId);

    const couponCode = uuidv4();

    const coupon = await this.couponsRepository.create({
      couponType,
      couponCode,
      expiresAt,
    });
    await this.couponsRepository.save(coupon);

    return {
      message: `A new coupon was successfully issued`,
      couponCode,
      expiresAt,
    };
  }

  async useCoupon(code: string) {
    const coupon = await this.findOneByCouponCode(code);

    // 쿠폰 사용 여부 검증
    if (coupon.isUsed) {
      throw new BadRequestException("Coupon already used.");
    }

    if (coupon.isDeleted) {
      throw new BadRequestException("Invalid coupon");
    }

    // 쿠폰 만료기간 체크
    if (coupon.expiresAt < new Date(Date.now())) {
      throw new BadRequestException("Expired coupon.");
    }

    coupon.isUsed = true;

    await this.couponsRepository.save(coupon);
  }

  async setDiscountAmount(amount: number) {}
  // async useCoupon(code: string, orderId: number) {
  //   const coupon = await this.findOneByCouponCode(code);

  //   // 쿠폰 사용 여부 검증
  //   if (coupon.isUsed) {
  //     throw new BadRequestException("Coupon already used.");
  //   }

  //   const order = await this.ordersRepository.findOne({ where: { id: orderId } });
  //   if (!order) {
  //     throw new NotFoundException(`Order (id: ${orderId}) not found.`);
  //   }

  //   const deliveryCost = await this.deliveryCostsService.findOneByCountryCode(
  //     order.country.countryCode
  //   );

  //   return deliveryCost;

  //   // TODO: order -> 쿠폰 정보 추가 및 쿠폰 적용 후 가격 관련 필드 업데이트
  //   order.coupon = coupon;

  //   // TODO: coupon 엔터티 사용 처리
  //   // const deliveryCost = await this.deliveryCostsService.findOneByCountryCode();
  //   // return deliveryCost;

  //   if (coupon.couponType.type === COUPONE_TYPE_ENUM.SHIPPING_FEE) {
  //     // TODO: 배송비 할인 처리
  //   } else if (coupon.couponType.type === COUPONE_TYPE_ENUM.FIXED_VALUE) {
  //     // TODO: 정액 할인 처리
  //   } else if (coupon.couponType.type === COUPONE_TYPE_ENUM.PERCENTAGE) {
  //     // TODO: % 할인 처리
  //   }

  //   return coupon;
  // }

  findAll() {
    return `This action returns all coupons`;
  }

  async findOneByCouponCode(code: string) {
    const coupon = await this.couponsRepository.findOne({
      where: { couponCode: code },
      relations: ["couponType", "order"],
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon (code: ${code}) not found.`);
    }

    return coupon;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  async remove(code: string): Promise<DeleteCouponResponseDto> {
    const coupon = await this.findOneByCouponCode(code);
    coupon.isDeleted = true;
    await this.couponsRepository.save(coupon);

    return {
      message: `Coupon (code: ${code}) was successfully deleted.`,
    };
  }
}
