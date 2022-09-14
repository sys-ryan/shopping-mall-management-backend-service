import { HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PAY_STATE_ENUM } from "../../common/enums";
import { Repository } from "typeorm";
import { CountriesService } from "../countries/countries.service";
import { CouponsService } from "../coupons/coupons.service";
import { DeliveryCostsService } from "../delivery_costs/delivery_costs.service";
import { UsersService } from "../users/users.service";
import { Orders } from "./entities/orders.entity";
import { OrdersService } from "./orders.service";

const orders: Orders[] = [];

const mockOrdersRepository = () => {
  return {
    create: jest.fn().mockImplementation((orderInfo) => ({
      ...orderInfo,
      id: 1,
      payState: PAY_STATE_ENUM.IN_PROGRESS,
    })),
    save: jest.fn().mockImplementation((order) => {
      let index: number;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === order.id) {
          index = i;
          break;
        }
      }

      if (index) {
        orders.splice(index, 1);
      }
      orders.push(order);
    }),
    find: jest.fn().mockImplementation(() => orders),
    findOne: jest.fn().mockImplementation((query) => {
      const where = query.where;

      let existingOrder: Orders;

      if (where.id) {
        orders.forEach((order) => {
          if (order.id === where.id) {
            existingOrder = order;
          }
        });
      }

      return existingOrder;
    }),
    remove: jest.fn(),
  };
};

const mockUsersService = () => ({
  findOneById: jest.fn().mockImplementation((id: number) => ({
    id: 1,
    name: "test user",
  })),
});

const mockCountriesService = () => ({
  findOneByCountryCode: jest.fn().mockImplementation((countryCode: string) => ({
    id: 221,
    countryCode: "US",
    countryDcode: 1,
    countryName: "USA",
  })),
});

const mockCouponsService = () => ({
  findOneByCouponCode: jest.fn(),
  useCoupon: jest.fn(),
  setDiscountAmount: jest.fn(),
});

const mockDeliveryCostsService = () => ({
  findOne: jest.fn().mockImplementation((code, quantity) => ({
    id: 228,
    quantity: 3,
    cost: 65750,
    countryId: 221,
  })),
});

const mockHttpService = () => ({
  get: jest.fn(),
});

jest.mock("rxjs", () => {
  const original = jest.requireActual("rxjs");
  return {
    ...original,
    lastValueFrom: () => {
      return {
        data: [{ basePrice: 1300 }],
      };
    },
  };
});

describe("OrdersService Unit Test", () => {
  let service: OrdersService;
  let ordersRepository: Repository<Orders>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Orders),
          useValue: mockOrdersRepository(),
        },
        {
          provide: UsersService,
          useValue: mockUsersService(),
        },
        {
          provide: CountriesService,
          useValue: mockCountriesService(),
        },
        {
          provide: DeliveryCostsService,
          useValue: mockDeliveryCostsService(),
        },
        {
          provide: CouponsService,
          useValue: mockCouponsService(),
        },
        {
          provide: HttpService,
          useValue: mockHttpService(),
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(getRepositoryToken(Orders));
  });

  afterEach(async () => {
    orders.splice(0, orders.length);
  });

  const defaultOrderObject = {
    userId: 1,
    quantity: 3,
    countryCode: "US",
    originalPrice: 100,
    buyrCity: "New York",
    buyrZipx: "12345",
    couponCode: null,
    vccode: 1,
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("주문 생성 기능 검증", async () => {
    const order = await service.create(defaultOrderObject);

    expect(order.message).toBeDefined();
    expect(orders).toHaveLength(1);
  });

  it("주문 목록 조회 기능 검증", async () => {
    await service.create(defaultOrderObject);

    await service.create({
      userId: 2,
      quantity: 5,
      countryCode: "US",
      originalPrice: 100,
      buyrCity: "Florida",
      buyrZipx: "44444",
      couponCode: null,
      vccode: 1,
    });

    await service.create({
      userId: 3,
      quantity: 2,
      countryCode: "US",
      originalPrice: 150,
      buyrCity: "Florida",
      buyrZipx: "55555",
      couponCode: null,
      vccode: 1,
    });

    const fetchedOrders = await service.findAll({
      startDate: null,
      endDate: null,
      payState: null,
      buyrCity: null,
      buyrCountry: null,
      buyrName: null,
    });
    expect(fetchedOrders).toHaveLength(3);
  });

  it("주문 조회 기능 검증", async () => {
    await service.create(defaultOrderObject);

    const order = await service.findOneById(1);

    expect(order.buyrCity).toEqual("New York");
  });

  it("주문 상태 변경 기능 검증", async () => {
    await service.create(defaultOrderObject);

    expect(orders[0].payState).toEqual(PAY_STATE_ENUM.IN_PROGRESS);

    await service.update(1, { status: PAY_STATE_ENUM.CANCELED });

    expect(orders[0].payState).toEqual(PAY_STATE_ENUM.CANCELED);
  });
});
