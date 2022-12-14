import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DELIVERY_STATUS_ENUM, PAY_STATE_ENUM } from "../../common/enums";
import { Repository } from "typeorm";
import { OrdersService } from "../orders/orders.service";
import { DeliveriesService } from "./deliveries.service";
import { Deliveries } from "./entities/deliveries.entity";

const deliveries: Deliveries[] = [];

const mockDeliveriesRepository = () => {
  return {
    create: jest.fn().mockImplementation((order) => ({
      id: 1,
      status: DELIVERY_STATUS_ENUM.SHIPPING,
      order,
    })),
    save: jest.fn((delivery) => {
      let index: number;
      for (var i = 0; i < deliveries.length; i++) {
        if (deliveries[i].id === delivery.id) {
          index = i;
          break;
        }
      }

      if (index) {
        deliveries.splice(index, 1);
      }
      deliveries.push({
        id: 1,
        ...delivery,
      });
    }),
    find: jest.fn().mockImplementation(() => deliveries),
    findOne: jest.fn().mockImplementation((query) => {
      const where = query.where;

      let existingDelivery: Deliveries;
      if (where.id) {
        deliveries.forEach((delivery) => {
          if (delivery.id === where.id) {
            existingDelivery = delivery;
          }
        });
      }

      return existingDelivery;
    }),
  };
};

const mockOrdersService = () => ({
  findOneById: jest.fn().mockImplementation((id) => defaultOrderObject),
});

const defaultOrderObject = {
  id: 1,
  userId: 1,
  quantity: 3,
  countryCode: "US",
  originalPrice: 100,
  buyrCity: "New York",
  buyrZipx: "12345",
  couponCode: null,
  vccode: 1,
  payState: PAY_STATE_ENUM.COMPLETED,
};

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

  afterEach(async () => {
    deliveries.splice(0, deliveries.length);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("?????? ?????? ??????(?????? ?????? ??????) ?????? ??????", async () => {
    await service.create({ orderId: 1 });

    expect(deliveries).toHaveLength(1);
    expect(deliveries[0].status).toEqual(DELIVERY_STATUS_ENUM.SHIPPING);
  });

  it("?????? ?????? ????????????(?????????, ?????? ??????) ?????? ??????", async () => {
    await service.create({ orderId: 1 });
    expect(deliveries[0].status).toEqual(DELIVERY_STATUS_ENUM.SHIPPING);

    await service.update(1, { status: DELIVERY_STATUS_ENUM.COMPLETED });
    expect(deliveries[0].status).toEqual(DELIVERY_STATUS_ENUM.COMPLETED);
  });

  it("?????? ?????? ?????? ?????? ??????", async () => {
    await service.create({ orderId: 1 });
    await service.create({ orderId: 2 });
    await service.create({ orderId: 3 });

    const fetchedDeliveries = await service.findAll({ status: null });
    expect(fetchedDeliveries).toHaveLength(3);
  });
});
