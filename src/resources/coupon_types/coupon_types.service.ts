import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { CreateCouponTypeDto, CreateCouponTypeResponseDto } from "./dto/create-coupon_type.dto";
import { FindCouponTypeDto } from "./dto/find-coupon_type.dto";
import { UpdateCouponTypeDto } from "./dto/update-coupon_type.dto";
import { CouponTypes } from "./entities/coupon_types.entity";

@Injectable()
export class CouponTypesService {
  constructor(
    @InjectRepository(CouponTypes) private couponTypesRepository: Repository<CouponTypes>
  ) {}

  async create(createCouponTypeDto: CreateCouponTypeDto): Promise<CreateCouponTypeResponseDto> {
    const { name, type, discountValue } = createCouponTypeDto;

    const newCouponType = await this.couponTypesRepository.create({ name, type, discountValue });

    await this.couponTypesRepository.save(newCouponType);

    return {
      message: `Coupon Type was created successfully.`,
    };
  }

  async findAll(filters: FindCouponTypeDto) {
    const whereOptions: FindOptionsWhere<CouponTypes> = {};
    // 쿠폰 타입 검색
    if (filters.type) {
      whereOptions.type = filters.type;
    }

    // 쿠폰 이름 검색
    if (filters.name) {
      whereOptions.name = Like(`%${filters.name}%`);
    }

    // TODO: 쿠폰 사용 횟수 - 쿠폰 기능 구현 후 작업

    // TODO: 총 할인액 - 쿠폰 기능 구현 후 작업

    const couponTypes = await this.couponTypesRepository.find({ where: whereOptions });

    return couponTypes;
  }

  async findOneById(id: number) {
    const couponType = await this.couponTypesRepository.findOne({ where: { id } });

    if (!couponType) {
      throw new NotFoundException("Coupon type not found.");
    }

    return couponType;
  }

  update(id: number, updateCouponTypeDto: UpdateCouponTypeDto) {
    return `This action updates a #${id} couponType`;
  }

  remove(id: number) {
    return `This action removes a #${id} couponType`;
  }
}
