import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { setupApp } from "./setup-app";
import { COUPONE_TYPE_ENUM } from "../src/common/enums";
import { CouponTypes } from "src/resources/coupon_types/entities/coupon_types.entity";
import { CreateCouponDto } from "src/resources/coupons/dto/create-coupon.dto";
import { Coupons } from "src/resources/coupons/entities/coupons.entity";
import { CreateOrderDto } from "src/resources/orders/dto/create-order.dto";
import { Orders } from "src/resources/orders/entities/orders.entity";

describe("Coupons (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  describe("쿠폰", () => {
    it("쿠폰 타입 목록 조회 기능 검증", async () => {
      let response = await request(app.getHttpServer())
        .post(`/api/v1/coupon-types`)
        .send({ name: "배송비 할인 쿠폰", type: COUPONE_TYPE_ENUM.SHIPPING_FEE, discountValue: 1 });
      response = await request(app.getHttpServer())
        .post(`/api/v1/coupon-types`)
        .send({ name: "정액 할인 쿠폰", type: COUPONE_TYPE_ENUM.FIXED_VALUE, discountValue: 3000 });

      response = await request(app.getHttpServer()).get(`/api/v1/coupon-types`);
      const couponTypes: CouponTypes[] = response.body;

      expect(couponTypes).toHaveLength(2);
      expect(couponTypes[0].type).toEqual(COUPONE_TYPE_ENUM.SHIPPING_FEE);
    });

    it("쿠폰 사용에 따른 할인 적용 기능검증 (배송비 할인)", async () => {
      // 배송비 할인 쿠폰 타입 생성
      let response = await request(app.getHttpServer())
        .post(`/api/v1/coupon-types`)
        .send({ name: "배송비 할인 쿠폰", type: COUPONE_TYPE_ENUM.SHIPPING_FEE, discountValue: 1 });
      response = await request(app.getHttpServer()).get(`/api/v1/coupon-types`);
      const couponType: CouponTypes = response.body[0];

      // 배송비 할인 쿠폰 발행 (1년 후 후 만료)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getFullYear() + 3);

      response = await request(app.getHttpServer())
        .post(`/api/v1/coupons`)
        .send({ couponTypeId: couponType.id, expiresAt } as CreateCouponDto);

      const coupon: Coupons = response.body;

      // 쿠폰 적용 주문 생성
      const city = "Unique City";
      response = await request(app.getHttpServer())
        .post(`/api/v1/orders`)
        .send({
          userId: 1,
          quantity: 5,
          originalPrice: 100,
          countryCode: "KR",
          buyrCity: city,
          buyrZipx: "05003",
          vccode: 82,
          couponCode: coupon.couponCode,
        } as CreateOrderDto);
      expect(response.statusCode).toBe(201);

      response = await request(app.getHttpServer()).get(`/api/v1/orders?buyrCity=${city}`);

      const order: Orders = response.body[0];
      expect(order.originalDeliveryCost).not.toEqual(order.finalDeliveryCost);
    });
  });

  it("쿠폰 사용에 따른 할인 적용 기능검증 (상품 가격 정액 할인)", async () => {
    const discountValue = 10;
    // 배송비 할인 쿠폰 타입 생성
    let response = await request(app.getHttpServer())
      .post(`/api/v1/coupon-types`)
      .send({ name: "정액 할인 쿠폰", type: COUPONE_TYPE_ENUM.FIXED_VALUE, discountValue });
    response = await request(app.getHttpServer()).get(`/api/v1/coupon-types`);
    const couponType: CouponTypes = response.body[0];

    // 배송비 할인 쿠폰 발행 (1년 후 후 만료)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getFullYear() + 3);

    response = await request(app.getHttpServer())
      .post(`/api/v1/coupons`)
      .send({ couponTypeId: couponType.id, expiresAt } as CreateCouponDto);

    const coupon: Coupons = response.body;

    // 쿠폰 적용 주문 생성
    const city = "Unique City";
    response = await request(app.getHttpServer())
      .post(`/api/v1/orders`)
      .send({
        userId: 1,
        quantity: 5,
        originalPrice: 100,
        countryCode: "KR",
        buyrCity: city,
        buyrZipx: "05003",
        vccode: 82,
        couponCode: coupon.couponCode,
      } as CreateOrderDto);
    expect(response.statusCode).toBe(201);

    response = await request(app.getHttpServer()).get(`/api/v1/orders?buyrCity=${city}`);

    const order: Orders = response.body[0];
    expect(+order.originalPrice).toEqual(+order.finalPrice + discountValue);
  });

  it("쿠폰 사용에 따른 할인 적용 기능검증 (상품 가격 % 할인)", async () => {
    const discountValue = 10;
    // 배송비 할인 쿠폰 타입 생성
    let response = await request(app.getHttpServer())
      .post(`/api/v1/coupon-types`)
      .send({ name: "정액 할인 쿠폰", type: COUPONE_TYPE_ENUM.PERCENTAGE, discountValue });
    response = await request(app.getHttpServer()).get(`/api/v1/coupon-types`);
    const couponType: CouponTypes = response.body[0];

    // 배송비 할인 쿠폰 발행 (1년 후 후 만료)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getFullYear() + 3);

    response = await request(app.getHttpServer())
      .post(`/api/v1/coupons`)
      .send({ couponTypeId: couponType.id, expiresAt } as CreateCouponDto);

    const coupon: Coupons = response.body;

    // 쿠폰 적용 주문 생성
    const city = "Unique City";
    response = await request(app.getHttpServer())
      .post(`/api/v1/orders`)
      .send({
        userId: 1,
        quantity: 5,
        originalPrice: 100,
        countryCode: "KR",
        buyrCity: city,
        buyrZipx: "05003",
        vccode: 82,
        couponCode: coupon.couponCode,
      } as CreateOrderDto);
    expect(response.statusCode).toBe(201);

    response = await request(app.getHttpServer()).get(`/api/v1/orders?buyrCity=${city}`);

    const order: Orders = response.body[0];
    expect(+order.finalPrice).toEqual(+order.originalPrice * (1 - discountValue / 100));
  });
});
