import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CouponTypesService } from "../coupon_types/coupon_types.service";
import { CouponsService } from "./coupons.service";
import { Coupons } from "./entities/coupons.entity";

const coupons: Coupons[] = [];

const mockCouponsRepository = () => ({
  create: jest.fn().mockImplementation((coupon) => ({
    id: 1,
    isUsed: false,
    isDeleted: false,
    discountAmoutn: 0,
    ...coupon,
  })),
  save: jest.fn().mockImplementation((coupon) => {
    coupons.push(coupon);
  }),
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockCouponTypesService = () => ({
  findOneById: jest.fn(),
});

describe("CouponsService", () => {
  let service: CouponsService;
  let couponsRepository: Repository<Coupons>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        { provide: getRepositoryToken(Coupons), useValue: mockCouponsRepository() },
        { provide: CouponTypesService, useValue: mockCouponTypesService() },
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
    couponsRepository = module.get(getRepositoryToken(Coupons));
  });

  afterEach(async () => {
    coupons.splice(0, coupons.length);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
