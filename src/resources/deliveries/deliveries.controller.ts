import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DeliveriesService } from "./deliveries.service";
import { CreateDeliveryDto, CreateDeliveryResponseDto } from "./dto/create-delivery.dto";
import { UpdateDeliveryDto, UpdateDeliveryResponseDto } from "./dto/update-delivery.dto";
import { Deliveries } from "./entities/deliveries.entity";

@ApiTags("Deliveries API")
@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @ApiOperation({ summary: "배송 생성 API", description: "주문에 대한 배송 처리를 수행합니다." })
  @ApiCreatedResponse({
    description: "주문에 대한 새로운 배송을 생성합니다.",
    type: CreateDeliveryResponseDto,
  })
  @Post()
  @HttpCode(201)
  create(@Body() createDeliveryDto: CreateDeliveryDto): Promise<CreateDeliveryResponseDto> {
    return this.deliveriesService.create(createDeliveryDto);
  }

  @ApiOperation({ summary: "배송 조회 API", description: "Order ID로 배송 상태를 조회합니다." })
  @ApiOkResponse({
    description: "Order ID로 배송 상태를 조회합니다.",
    type: CreateDeliveryResponseDto,
  })
  @Get()
  findOneByOrderId(@Query("orderId", ParseIntPipe) orderId: number): Promise<Deliveries> {
    return this.deliveriesService.findOneByOrderId(orderId);
  }

  @Get()
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deliveriesService.findOne(+id);
  }

  @ApiOperation({
    summary: "배송 상태 변경 API",
    description: "주문에 대한 배송 상태를 변경합니다.",
  })
  @ApiOkResponse({
    description: "배송 상태를 수정합니다. (shipping, completed)",
    type: UpdateDeliveryResponseDto,
  })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto
  ): Promise<UpdateDeliveryResponseDto> {
    return this.deliveriesService.update(+id, updateDeliveryDto);
  }
}
