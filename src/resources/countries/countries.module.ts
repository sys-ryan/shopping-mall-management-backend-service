import { Module } from "@nestjs/common";
import { CountriesService } from "./countries.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "./entities/countries.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
