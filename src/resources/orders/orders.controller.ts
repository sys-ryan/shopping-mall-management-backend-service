import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, CreateOrderResponseDto } from "./dto/create-order.dto";
import { UpdateOrderDto, UpdateOrderResponseDto } from "./dto/update-order.dto";
import { FindOrdersDto } from "./dto/find-orders.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Orders } from "./entities/orders.entity";
import { DeleteOrderResponseDto } from "./dto/delete-order.dto";

@ApiTags("Orders API")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: "주문 생성 API",
    description: "주문을 생성합니다.",
  })
  @ApiCreatedResponse({ description: "주문을 생성합니다.", type: CreateOrderResponseDto })
  @Post()
  @HttpCode(201)
  create(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({
    summary: "주문 목록 조회 API",
    description: "주문 목록을 조회합니다.",
  })
  @ApiOkResponse({ description: "주문 목록을 조회합니다.", type: Orders, isArray: true })
  @Get()
  findAll(@Query() filters: FindOrdersDto): Promise<Orders[]> {
    return this.ordersService.findAll(filters);
  }

  @ApiOperation({
    summary: "주문 정보 조회 API",
    description: "주문 정보를 조회합니다.",
  })
  @ApiOkResponse({ description: "주문 정보를 조회합니다.", type: Orders })
  @Get(":id")
  findOneById(@Param("id") id: string): Promise<Orders> {
    return this.ordersService.findOneById(+id);
  }

  @ApiOperation({
    summary: "주문 상태 변경 API",
    description: "주문 상태를 변경합니다. (in_progress, completed, canceled",
  })
  @ApiOkResponse({
    description: "주문 상태를 변경합니다. (in_progress, completed, canceled",
    type: UpdateOrderResponseDto,
  })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<UpdateOrderResponseDto> {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @ApiOperation({ summary: "주문 삭제 API", description: "주문을 삭제합니다." })
  @ApiOkResponse({ description: "주문을 삭제합니다.", type: DeleteOrderResponseDto })
  @Delete(":id")
  remove(@Param("id") id: string): Promise<DeleteOrderResponseDto> {
    return this.ordersService.remove(+id);
  }
}
