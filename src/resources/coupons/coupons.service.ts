import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CouponTypesService } from "../coupon_types/coupon_types.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { Coupons } from "./entities/coupons.entity";

import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupons) private couponsRepository: Repository<Coupons>,
    private couponTypesService: CouponTypesService
  ) {}

  async create(createCouponDto: CreateCouponDto) {
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

  findAll() {
    return `This action returns all coupons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
