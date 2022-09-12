import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entities/orders.entity";
import { Users } from "../users/entities/users.entity";
import { UsersModule } from "../users/users.module";
import { CountriesModule } from "../countries/countries.module";

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Users]), UsersModule, CountriesModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
