import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto, CreateCouponResponseDto } from "./dto/create-coupon.dto";
import { DeleteCouponResponseDto } from "./dto/delete-coupon.dto";
import { Coupons } from "./entities/coupons.entity";

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

  @ApiOperation({ summary: "쿠폰 조회 API", description: "쿠폰 코드로 쿠폰 정보를 조회합니다." })
  @ApiOkResponse({ description: "쿠폰 코드로 쿠폰 정보를 조회합니다.", type: Coupons })
  @Get(":code")
  findOneByCouponCode(@Param("code") code: string): Promise<Coupons> {
    return this.couponsService.findOneByCouponCode(code);
  }

  @ApiOperation({ summary: "쿠폰을 삭제합니다.", description: "쿠폰 코드로 쿠폰을 삭제합니다." })
  @ApiOkResponse({ description: "쿠폰 코드로 쿠폰을 삭제합니다.", type: DeleteCouponResponseDto })
  @Delete(":code")
  remove(@Param("code") code: string): Promise<DeleteCouponResponseDto> {
    return this.couponsService.remove(code);
  }
}
