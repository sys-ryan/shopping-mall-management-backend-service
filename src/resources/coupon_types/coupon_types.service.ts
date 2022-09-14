import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindOptionsWhere, Like, Repository } from "typeorm";
import { Coupons } from "../coupons/entities/coupons.entity";
import { CreateCouponTypeDto, CreateCouponTypeResponseDto } from "./dto/create-coupon_type.dto";
import { FindCouponTypeDto, FindCouponTypeResponseDto } from "./dto/find-coupon_type.dto";
import { CouponTypes } from "./entities/coupon_types.entity";

@Injectable()
export class CouponTypesService {
  constructor(
    @InjectRepository(CouponTypes) private couponTypesRepository: Repository<CouponTypes>,
    @InjectRepository(Coupons) private couponsRepository: Repository<Coupons>,
    private dataSource: DataSource
  ) {}

  async create(createCouponTypeDto: CreateCouponTypeDto): Promise<CreateCouponTypeResponseDto> {
    const { name, type, discountValue } = createCouponTypeDto;

    const newCouponType = await this.couponTypesRepository.create({ name, type, discountValue });

    await this.couponTypesRepository.save(newCouponType);

    return {
      message: `Coupon Type was created successfully.`,
    };
  }

  async findAll(filters: FindCouponTypeDto): Promise<Partial<FindCouponTypeResponseDto>[]> {
    const whereOptions: FindOptionsWhere<CouponTypes> = {};
    // 쿠폰 타입 검색
    if (filters.type) {
      whereOptions.type = filters.type;
    }

    // 쿠폰 이름 검색
    if (filters.name) {
      whereOptions.name = Like(`%${filters.name}%`);
    }

    const couponTypes: Partial<FindCouponTypeResponseDto>[] = await this.couponTypesRepository.find(
      {
        where: whereOptions,
      }
    );

    // 쿠폰 유형별 쿠폰 사용 횟수, 총 할인액
    for (var i = 0; i < couponTypes.length; i++) {
      const usedCoupons = await this.couponsRepository.find({
        where: { couponType: couponTypes[i], isUsed: true },
      });

      // usedCount: 쿠폰 사용 횟수
      const usedCount = usedCoupons.length;
      couponTypes[i].usedCount = usedCount;

      let totalDiscountAmount = 0;

      // 쿠폰 사용 횟수가 0보다 클 경우 쿠폰의 총 할인 액 계산
      if (usedCount > 0) {
        const result = await this.dataSource
          .getRepository(CouponTypes)
          .createQueryBuilder("coupon_types")
          .leftJoin("coupon_types.coupons", "coupons")
          .select("SUM(coupons.discount_amount)", "totalDiscountAmount")
          .where("coupons.couponTypeId = :couponTypeId", { couponTypeId: couponTypes[i].id })
          .andWhere("coupons.is_used = :isUsed", {
            isUsed: true,
          })
          .execute();

        totalDiscountAmount = result[0].totalDiscountAmount;
      }

      couponTypes[i].totalDiscountAmount = +totalDiscountAmount;
    }

    return couponTypes;
  }

  async findOneById(id: number): Promise<CouponTypes> {
    const couponType = await this.couponTypesRepository.findOne({ where: { id } });

    const usedCoupons = await this.couponsRepository.find({ where: { couponType, isUsed: true } });

    const usedCount = usedCoupons.length;

    if (usedCount > 0) {
    }

    if (!couponType) {
      throw new NotFoundException("Coupon type not found.");
    }

    return couponType;
  }
}
