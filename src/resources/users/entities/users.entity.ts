import { Orders } from "src/resources/orders/entities/orders.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 50,
    comment: "해당 컬럄은 사용자(주문자)의 이름을 나타냅니다.",
  })
  name: string;

  @Column({
    type: "boolean",
    name: "is_deleted",
    comment: "해당 컬럼은 사용자 삭제 여부를 나타냅니다.",
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn()
  orders: Orders[];
}
