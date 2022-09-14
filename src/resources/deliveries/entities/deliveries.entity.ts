import { DELIVERY_STATUS_ENUM } from "src/common/enums";
import { Orders } from "src/resources/orders/entities/orders.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deliveries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: DELIVERY_STATUS_ENUM,
    default: DELIVERY_STATUS_ENUM.SHIPPING,
    comment: "해당 컬럼은 배송 상태를 나타냅니다.",
  })
  status: DELIVERY_STATUS_ENUM;

  @OneToOne(() => Orders, (order) => order.delivery)
  @JoinColumn()
  order: Orders;
}
