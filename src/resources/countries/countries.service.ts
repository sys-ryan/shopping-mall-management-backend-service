import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { Countries } from "./entities/countries.entity";

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Countries) private countriesRepository: Repository<Countries>) {}

  create(createCountryDto: CreateCountryDto) {
    return "This action adds a new country";
  }

  findAll() {
    return `This action returns all countries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

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

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
