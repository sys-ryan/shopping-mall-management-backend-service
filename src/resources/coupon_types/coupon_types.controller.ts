import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CouponTypesService } from "./coupon_types.service";
import { CreateCouponTypeDto, CreateCouponTypeResponseDto } from "./dto/create-coupon_type.dto";
import { FindCouponTypeDto } from "./dto/find-coupon_type.dto";
import { UpdateCouponTypeDto } from "./dto/update-coupon_type.dto";
import { CouponTypes } from "./entities/coupon_types.entity";

@ApiTags("CouponTypes API")
@Controller("coupon-types")
export class CouponTypesController {
  constructor(private readonly couponTypesService: CouponTypesService) {}

  @ApiOperation({
    summary: "새로운 쿠폰 유형 생성 API",
    description: "쿠폰 유형을 생성합니다.",
  })
  @ApiCreatedResponse({ description: "쿠폰 유형을 생성합니다.", type: CreateCouponTypeResponseDto })
  @HttpCode(201)
  @Post()
  create(@Body() createCouponTypeDto: CreateCouponTypeDto): Promise<CreateCouponTypeResponseDto> {
    return this.couponTypesService.create(createCouponTypeDto);
  }

  @ApiOperation({ summary: "쿠폰 유형 목록 조회 API", description: "쿠폰 유형 목록을 조회합니다." })
  @ApiOkResponse({ description: "쿠폰 유형 목록을 조회합니다.", type: CouponTypes, isArray: true })
  @Get()
  findAll(@Query() filters: FindCouponTypeDto): Promise<CouponTypes[]> {
    return this.couponTypesService.findAll(filters);
  }

  @ApiOperation({
    summary: "쿠폰 유형 조회 API",
    description: "쿠폰 유형 ID로 쿠폰 유형에 대한 정보를 조회합니다.",
  })
  @ApiOkResponse({
    description: "쿠폰 유형 ID로 쿠폰 유형에 대한 정보를 조회합니다.",
    type: CouponTypes,
  })
  @Get(":id")
  findOneById(@Param("id") id: string): Promise<CouponTypes> {
    return this.couponTypesService.findOneById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCouponTypeDto: UpdateCouponTypeDto) {
    return this.couponTypesService.update(+id, updateCouponTypeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.couponTypesService.remove(+id);
  }
}
