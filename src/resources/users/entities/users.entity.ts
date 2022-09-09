import { Orders } from "src/resources/orders/entities/orders.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 20,
    comment: "해당 컬럄안 사용자(주문자)의 이름을 나타냅니다.",
  })
  name: string;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn()
  orders: Orders[];
}
