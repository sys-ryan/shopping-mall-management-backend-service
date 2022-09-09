import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./resources/users/users.module";
import { CountriesModule } from "./resources/countries/countries.module";
import { DeliveryCostsModule } from "./resources/delivery_costs/delivery_costs.module";
import { CouponTypesModule } from "./resources/coupon_types/coupon_types.module";
import { CouponesModule } from "./resources/coupones/coupones.module";
import { DeliveriesModule } from "./resources/deliveries/deliveries.module";
import { OrdersModule } from "./resources/orders/orders.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        PORT: Joi.number(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    CountriesModule,
    DeliveryCostsModule,
    CouponTypesModule,
    CouponesModule,
    DeliveriesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
