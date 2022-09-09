import { Test, TestingModule } from '@nestjs/testing';
import { CouponesController } from './coupones.controller';
import { CouponesService } from './coupones.service';

describe('CouponesController', () => {
  let controller: CouponesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponesController],
      providers: [CouponesService],
    }).compile();

    controller = module.get<CouponesController>(CouponesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
