import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto, CreateCouponResponseDto } from "./dto/create-coupon.dto";
import { DeleteCouponResponseDto } from "./dto/delete-coupon.dto";

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

  @Get(":code")
  findOneByCouponCode(@Param("code") code: string) {
    return this.couponsService.findOneByCouponCode(code);
  }

  @Delete(":code")
  remove(@Param("code") code: string): Promise<DeleteCouponResponseDto> {
    return this.couponsService.remove(code);
  }
}
