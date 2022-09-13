import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, CreateOrderResponseDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
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

  @Get(":id")
  findOneById(@Param("id") id: string): Promise<Orders> {
    return this.ordersService.findOneById(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<DeleteOrderResponseDto> {
    return this.ordersService.remove(+id);
  }
}
