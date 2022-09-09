import { Test, TestingModule } from '@nestjs/testing';
import { CouponTypesService } from './coupon_types.service';

describe('CouponTypesService', () => {
  let service: CouponTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponTypesService],
    }).compile();

    service = module.get<CouponTypesService>(CouponTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
