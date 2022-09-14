import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { setupApp } from "./setup-app";
import { Orders } from "../src/resources/orders/entities/orders.entity";
import { PAY_STATE_ENUM } from "../src/common/enums";
import { Users } from "src/resources/users/entities/users.entity";

const stringToDate = (date: string) => {
  const year = +date.slice(0, 4);
  const month = +date.slice(4, 6);
  const day = +date.slice(6, 8);

  return new Date(year, month - 1, day);
};

describe("Orders (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });
  describe("주문 내역)", () => {
    it("주문 내역 열람 기능 검증", async () => {
      const response = await request(app.getHttpServer()).get("/api/v1/orders");

      expect(response.statusCode).toEqual(200);

      const orders: Orders[] = response.body;
      expect(orders[0].id).toBeDefined();
    });

    it("주문 내역 검색 기능 검증 (by 주문 상태)", async () => {
      const response = await request(app.getHttpServer()).get("/api/v1/orders?payState=canceled");
      expect(response.statusCode).toEqual(200);

      let isOk = true;
      const orders: Orders[] = response.body;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].payState !== PAY_STATE_ENUM.CANCELED) {
          isOk = false;
        }
      }
      expect(isOk).toBe(true);
    });

    it("주문 내역 검색 기능 검증 (by 시작일자, 종료일자)", async () => {
      const start = "20220101";
      const end = "20220201";
      const response = await request(app.getHttpServer()).get(
        `/api/v1/orders?startDate=${start}&endDate=${end}`
      );

      const startDate = stringToDate(start);
      const endDate = stringToDate(end);

      let isOk = true;
      const orders: Orders[] = response.body;

      for (var i = 0; i < orders.length; i++) {
        const createdAt = new Date(orders[i].createdAt);

        if (createdAt < startDate || createdAt > endDate) {
          isOk = false;
        }
      }

      expect(isOk).toBe(true);
    });

    it("주문 내역 검색 기능 (by 주문자 명)", async () => {
      let response = await request(app.getHttpServer()).get(`/api/v1/users`);
      const user: Users = response.body[0];

      response = await request(app.getHttpServer()).get(`/api/v1/orders?buyrName=${user.name}`);
      const order: Orders = response.body[0];

      expect(order.user.name).toEqual(user.name);
    });

    it("주문 내역 검색 기능 (by 국가 코드)", async () => {
      const countryCode = "BR"; // Brazil

      const response = await request(app.getHttpServer()).get(
        `/api/v1/orders?buyrCountry=${countryCode}`
      );
      const orders: Orders[] = response.body;

      let isOk = true;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].country.countryCode !== countryCode) {
          isOk = false;
        }
      }

      expect(isOk).toBe(true);
    });
  });
});
