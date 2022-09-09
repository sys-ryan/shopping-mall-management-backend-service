import { Test, TestingModule } from '@nestjs/testing';
import { CouponTypesController } from './coupon_types.controller';
import { CouponTypesService } from './coupon_types.service';

describe('CouponTypesController', () => {
  let controller: CouponTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponTypesController],
      providers: [CouponTypesService],
    }).compile();

    controller = module.get<CouponTypesController>(CouponTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
