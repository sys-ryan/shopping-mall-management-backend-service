import { Injectable } from '@nestjs/common';
import { CreateCouponeDto } from './dto/create-coupone.dto';
import { UpdateCouponeDto } from './dto/update-coupone.dto';

@Injectable()
export class CouponesService {
  create(createCouponeDto: CreateCouponeDto) {
    return 'This action adds a new coupone';
  }

  findAll() {
    return `This action returns all coupones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupone`;
  }

  update(id: number, updateCouponeDto: UpdateCouponeDto) {
    return `This action updates a #${id} coupone`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupone`;
  }
}
