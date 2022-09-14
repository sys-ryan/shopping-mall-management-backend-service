import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CouponTypesService } from "../coupon_types/coupon_types.service";
import { CreateCouponDto, CreateCouponResponseDto } from "./dto/create-coupon.dto";
import { Coupons } from "./entities/coupons.entity";

import { v4 as uuidv4 } from "uuid";
import { Orders } from "../orders/entities/orders.entity";
import { DeleteCouponResponseDto } from "./dto/delete-coupon.dto";

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupons) private couponsRepository: Repository<Coupons>,
    private couponTypesService: CouponTypesService
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

  /**
   * 쿠폰을 사용 처리하는 서비스 함수
   * @param code 쿠폰 코드
   */
  async useCoupon(code: string): Promise<void> {
    const coupon = await this.findOneByCouponCode(code);

    // 쿠폰 사용 여부 검증
    if (coupon.isUsed) {
      throw new BadRequestException("Coupon already used.");
    }

    // 삭제 여부 체크
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

  /**
   * 쿠폰 사용시 쿠폰으로 할인받은 금액을 쿠폰 정보에 저장하는 함수
   * @param couponId 사용한 쿠폰 id
   * @param amount 쿠폰 사용으로 할인받은 금액
   */
  async setDiscountAmount(couponId: number, amount: number): Promise<void> {
    // 쿠폰에 discount amount 설정 기능
    const coupon = await this.couponsRepository.findOne({ where: { id: couponId } });
    if (!coupon) {
      throw new NotFoundException("Coupon not found.");
    }

    coupon.discountAmount = amount;

    await this.couponsRepository.save(coupon);
  }

  /**
   * 쿠폰 코드로 쿠폰에 대한 정보를 조회하는 서비스 함수
   * @param code 쿠폰 코드
   * @returns 쿠폰 정보
   */
  async findOneByCouponCode(code: string): Promise<Coupons> {
    const coupon = await this.couponsRepository.findOne({
      where: { couponCode: code },
      relations: ["couponType", "order"],
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon (code: ${code}) not found.`);
    }

    return coupon;
  }

  /**
   * 쿠폰 코드로 쿠폰을 삭제하는 함수 (soft delete)
   * @param code 쿠폰 코드
   * @returns { message }
   */
  async remove(code: string): Promise<DeleteCouponResponseDto> {
    const coupon = await this.findOneByCouponCode(code);
    coupon.isDeleted = true;
    await this.couponsRepository.save(coupon);

    return {
      message: `Coupon (code: ${code}) was successfully deleted.`,
    };
  }
}
