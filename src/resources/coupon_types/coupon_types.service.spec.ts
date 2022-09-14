import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { COUPONE_TYPE_ENUM } from "../../common/enums";
import { DataSource } from "typeorm";
import { Coupons } from "../coupons/entities/coupons.entity";
import { CouponTypesService } from "./coupon_types.service";
import { CouponTypes } from "./entities/coupon_types.entity";

const couponTypes: CouponTypes[] = [];

const mockCouponTypesRepository = () => ({
  create: jest.fn().mockImplementation((couponType) => ({
    ...couponType,
    id: 1,
  })),
  save: jest.fn().mockImplementation((couponType) => {
    couponTypes.push(couponType);
  }),
  find: jest.fn().mockImplementation(() => couponTypes),
  findOne: jest.fn(),
});

const mockCouponsRepository = () => ({
  find: jest.fn(),
});

const mockDateSource = () => ({});

describe("CouponTypesService Unit Test", () => {
  let service: CouponTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponTypesService,
        { provide: getRepositoryToken(CouponTypes), useValue: mockCouponTypesRepository() },
        { provide: getRepositoryToken(Coupons), useValue: mockCouponsRepository() },
        { provide: DataSource, useValue: mockDateSource() },
      ],
    }).compile();

    service = module.get<CouponTypesService>(CouponTypesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("쿠폰 타입 생성 기능 검증", async () => {
    await service.create({
      name: "배송비 할인 쿠폰",
      type: COUPONE_TYPE_ENUM.SHIPPING_FEE,
      discountValue: 1,
    });

    expect(couponTypes).toHaveLength(1);
    expect(couponTypes[0].type).toEqual(COUPONE_TYPE_ENUM.SHIPPING_FEE);
  });
});
