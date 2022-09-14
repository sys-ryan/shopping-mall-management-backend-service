import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrdersService } from "../orders/orders.service";
import { DeliveriesService } from "./deliveries.service";
import { Deliveries } from "./entities/deliveries.entity";

const deliveries: Deliveries[] = [];

const mockDeliveriesRepository = () => {
  return { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
};

const mockOrdersService = () => ({
  findOnebyId: jest.fn(),
});

describe("DeliveriesService", () => {
  let service: DeliveriesService;
  let deliveriesRepository: Repository<Deliveries>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        {
          provide: getRepositoryToken(Deliveries),
          useValue: mockDeliveriesRepository(),
        },
        {
          provide: OrdersService,
          useValue: mockOrdersService(),
        },
      ],
    }).compile();

    service = module.get<DeliveriesService>(DeliveriesService);
    deliveriesRepository = module.get(getRepositoryToken(Deliveries));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
