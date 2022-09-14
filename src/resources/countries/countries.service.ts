import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Countries } from "./entities/countries.entity";

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Countries) private countriesRepository: Repository<Countries>) {}

  /**
   * id로 Country를 조회합니다.
   * @param id Country ID
   * @returns
   */
  async findOneById(id: number): Promise<Countries> {
    const country = await this.countriesRepository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException("Country not found.");
    }

    return country;
  }

  /**
   * CounryCode로 Country를 조회합니다.
   * @param code Country Code
   * @returns Country
   */
  async findOneByCountryCode(code: string): Promise<Countries> {
    const country = await this.countriesRepository.findOne({ where: { countryCode: code } });
    if (!country) {
      throw new NotFoundException("Country not found.");
    }

    return country;
  }
}
