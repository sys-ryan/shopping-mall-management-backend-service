import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryCostsService } from './delivery_costs.service';

describe('DeliveryCostsService', () => {
  let service: DeliveryCostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryCostsService],
    }).compile();

    service = module.get<DeliveryCostsService>(DeliveryCostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
