import { Module } from "@nestjs/common";
import { CountriesService } from "./countries.service";
import { CountriesController } from "./countries.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "./entities/countries.entity";
import { DeliveryCosts } from "../delivery_costs/entities/delivery_costs.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
