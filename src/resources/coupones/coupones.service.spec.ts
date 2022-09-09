import { Test, TestingModule } from '@nestjs/testing';
import { CouponesService } from './coupones.service';

describe('CouponesService', () => {
  let service: CouponesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponesService],
    }).compile();

    service = module.get<CouponesService>(CouponesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
