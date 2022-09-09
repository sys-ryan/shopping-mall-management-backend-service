import { Injectable } from '@nestjs/common';
import { CreateCouponTypeDto } from './dto/create-coupon_type.dto';
import { UpdateCouponTypeDto } from './dto/update-coupon_type.dto';

@Injectable()
export class CouponTypesService {
  create(createCouponTypeDto: CreateCouponTypeDto) {
    return 'This action adds a new couponType';
  }

  findAll() {
    return `This action returns all couponTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} couponType`;
  }

  update(id: number, updateCouponTypeDto: UpdateCouponTypeDto) {
    return `This action updates a #${id} couponType`;
  }

  remove(id: number) {
    return `This action removes a #${id} couponType`;
  }
}
