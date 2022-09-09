import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryCostsController } from './delivery_costs.controller';
import { DeliveryCostsService } from './delivery_costs.service';

describe('DeliveryCostsController', () => {
  let controller: DeliveryCostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryCostsController],
      providers: [DeliveryCostsService],
    }).compile();

    controller = module.get<DeliveryCostsController>(DeliveryCostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
