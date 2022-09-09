import { Module } from "@nestjs/common";
import { CountriesService } from "./countries.service";
import { CountriesController } from "./countries.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "./entities/countries.entity";
import { DeliveryCosts } from "../delivery_costs/entities/delivery_costs.entity";

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
