import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto, CreateCouponResponseDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";

@ApiTags("Coupons API")
@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiOperation({
    summary: "쿠폰 발급 API",
    description: "쿠폰 유형에 대한 쿠폰 번호를 발급받습니다.",
  })
  @ApiCreatedResponse({
    description: "쿠폰 유형에 대한 쿠폰 번호를 발급받습니다.",
    type: CreateCouponResponseDto,
  })
  @Post()
  create(@Body() createCouponDto: CreateCouponDto): Promise<CreateCouponResponseDto> {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.couponsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(+id, updateCouponDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.couponsService.remove(+id);
  }
}
