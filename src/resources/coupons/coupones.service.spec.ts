import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { COUPONE_TYPE_ENUM } from "../../common/enums";
import { Repository } from "typeorm";
import { CouponTypesService } from "../coupon_types/coupon_types.service";
import { CouponsService } from "./coupons.service";
import { Coupons } from "./entities/coupons.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

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
    let index: number;
    for (var i = 0; i < coupons.length; i++) {
      if (coupons[i].id === coupon.id) {
        index = i;
        break;
      }
    }

    if (index) {
      coupons.splice(index, 1);
    }
    coupons.push(coupon);
  }),
  find: jest.fn(),
  findOne: jest.fn().mockImplementation((query) => {
    const where = query.where;

    let existingCoupon: Coupons;

    if (where.couponCode) {
      coupons.forEach((coupon) => {
        if (coupon.couponCode === where.couponCode) {
          existingCoupon = coupon;
        }
      });
    }

    return existingCoupon;
  }),
});

const mockCouponTypesService = () => ({
  findOneById: jest.fn().mockImplementation((id) => ({
    id: 1,
    name: "배송비 할인 쿠폰",
    type: COUPONE_TYPE_ENUM.SHIPPING_FEE,
    discountValue: 1,
  })),
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

  it("쿠폰 코드 발급 기능 검증", async () => {
    await service.create({ couponTypeId: 1, expiresAt: new Date(2022, 11, 4) });
    expect(coupons).toHaveLength(1);
    expect(coupons[0].couponCode).toBeDefined();
  });

  it("쿠폰 사용 처리 기능 검증(이미 사용되었을 경우 exception)", async () => {
    await service.create({ couponTypeId: 1, expiresAt: new Date(2022, 11, 4) });
    expect(coupons[0].isUsed).toEqual(false);
    const code = coupons[0].couponCode;

    await service.useCoupon(code);
    expect(coupons[0].isUsed).toEqual(true);

    await expect(service.useCoupon(code)).rejects.toBeInstanceOf(BadRequestException);
  });

  it("쿠폰 사용 처리 기능 검증(쿠폰이 만료되었을 경우 exception)", async () => {
    await service.create({ couponTypeId: 1, expiresAt: new Date(2019, 11, 4) });
    expect(coupons[0].isUsed).toEqual(false);
    const code = coupons[0].couponCode;

    await expect(service.useCoupon(code)).rejects.toBeInstanceOf(BadRequestException);
  });

  it("쿠폰 사용 처리 기능 검증(쿠폰이 만료되었을 경우 exception)", async () => {
    await service.create({ couponTypeId: 1, expiresAt: new Date(2019, 11, 4) });
    const code = "random-invalid-coupon-code";

    await expect(service.useCoupon(code)).rejects.toBeInstanceOf(NotFoundException);
  });
});
