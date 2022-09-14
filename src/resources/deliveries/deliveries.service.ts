import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrdersService } from "../orders/orders.service";
import { CreateDeliveryDto, CreateDeliveryResponseDto } from "./dto/create-delivery.dto";
import { FindDeliveryDto } from "./dto/find-delivery.dto";
import { UpdateDeliveryDto, UpdateDeliveryResponseDto } from "./dto/update-delivery.dto";
import { Deliveries } from "./entities/deliveries.entity";

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Deliveries) private deliveriesRepository: Repository<Deliveries>,
    private ordersService: OrdersService
  ) {}

  /**
   * 주문에 대한 배송을 생성합니다.
   * @param createDeliveryDto 배송 생성을 위한 request body DTO
   * @returns { message }
   */
  async create(createDeliveryDto: CreateDeliveryDto): Promise<CreateDeliveryResponseDto> {
    const { orderId } = createDeliveryDto;

    const order = await this.ordersService.findOneById(orderId);

    const newDelivery = await this.deliveriesRepository.create({ order });

    await this.deliveriesRepository.save(newDelivery);

    return {
      message: "Delivery was successfully created.",
    };
  }

  /**
   * 배송 목록 조회 서비스 함수
   * @param filters status에 따라 배송 목록 조회 결과를 필터링 할 수 있습니다.
   * @returns 배송 목록
   */
  async findAll(filters: FindDeliveryDto): Promise<Deliveries[]> {
    const deliveries = await this.deliveriesRepository.find({ where: { status: filters.status } });
    return deliveries;
  }

  /**
   * Order ID로 주문에 대한 배송 상태를 조회합니다.
   * @param orderId 조회하고자 하는 배송상태의 주문 id
   * @returns 배송 상태
   */
  async findOneByOrderId(orderId: number): Promise<Deliveries> {
    const delivery = await this.deliveriesRepository.findOne({ where: { order: { id: orderId } } });
    if (!delivery) {
      throw new NotFoundException(`Delivery(orderId: ${orderId}) not found.`);
    }

    return delivery;
  }

  /**
   * 배송 상태를 수정합니다.
   * @param id Delivery ID
   * @param updateDeliveryDto 배송 상태 수정을 위한 request body DTO
   * @returns { message }
   */
  async update(
    id: number,
    updateDeliveryDto: UpdateDeliveryDto
  ): Promise<UpdateDeliveryResponseDto> {
    const { status } = updateDeliveryDto;
    const delivery = await this.deliveriesRepository.findOne({ where: { id } });
    if (!delivery) {
      throw new NotFoundException("Delivery not found.");
    }

    delivery.status = status;

    await this.deliveriesRepository.save(delivery);

    return {
      message: `Delivery(id: ${id}) was successfully updated.`,
    };
  }
}
