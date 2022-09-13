import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CouponTypesService } from "./coupon_types.service";
import { CreateCouponTypeDto, CreateCouponTypeResponseDto } from "./dto/create-coupon_type.dto";
import { FindCouponTypeDto } from "./dto/find-coupon_type.dto";
import { UpdateCouponTypeDto } from "./dto/update-coupon_type.dto";

@Controller("coupon-types")
export class CouponTypesController {
  constructor(private readonly couponTypesService: CouponTypesService) {}

  @Post()
  create(@Body() createCouponTypeDto: CreateCouponTypeDto): Promise<CreateCouponTypeResponseDto> {
    return this.couponTypesService.create(createCouponTypeDto);
  }

  @Get()
  findAll(@Query() filters: FindCouponTypeDto) {
    return this.couponTypesService.findAll(filters);
  }

  @Get(":id")
  findOneById(@Param("id") id: string) {
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
