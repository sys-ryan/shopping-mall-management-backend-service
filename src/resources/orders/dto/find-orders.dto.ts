import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { PAY_STATE_ENUM } from "src/common/enums";

/**
 * 20220902 와 같은 날짜 string을 받아 파싱하여 해당 날짜에 해당하는 Date object를 반환합니다.
 * @param str 날짜 string (ex. 20220902)
 * @returns Date object
 */
export const getDateFromString = (str: string) => {
  const year = parseInt(str.slice(0, 4));
  const month = parseInt(str.slice(4, 6)) - 1;
  const day = parseInt(str.slice(6, 8));

  const date = new Date(year, month, day);

  return date;
};

/**
 * Orders를 조회할 때 사용될 수 있는 Query Parameter를 정의합니다.
 */
export class FindOrdersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PAY_STATE_ENUM)
  payState: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => getDateFromString(value), { toClassOnly: true })
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => getDateFromString(value), { toClassOnly: true })
  endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyrName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyrCity: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyrCountry: string;
}
