import { HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CountriesService } from "../countries/countries.service";
import { CouponsService } from "../coupons/coupons.service";
import { DeliveryCostsService } from "../delivery_costs/delivery_costs.service";
import { UsersService } from "../users/users.service";
import { Orders } from "./entities/orders.entity";
import { OrdersService } from "./orders.service";

const mockOrdersRepository = () => {
  const orders: Orders[] = [];

  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
};

const mockUsersService = () => ({
  findOneById: jest.fn(),
});

const mockCountriesService = () => ({
  findOneByCountryCode: jest.fn(),
});

const mockCouponsService = () => ({
  findOneByCouponCode: jest.fn(),
  useCoupon: jest.fn(),
  setDiscountAmount: jest.fn(),
});

const mockDeliveryCostsService = () => ({
  findOne: jest.fn(),
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
          useValue: mockCouponsService,
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

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
