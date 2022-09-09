import { DeliveryCosts } from "../../delivery_costs/entities/delivery_costs.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "src/resources/orders/entities/orders.entity";

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  country_index: number;

  @Column({ type: "int", comment: "이 컬럼은 국가 코드를 나타냅니다." })
  country_code: number;

  @Column({ type: "varchar", length: 3, comment: "이 컬럼은 Country Dialing Code를 나타냅니다." })
  country_decode: string;

  @Column({ type: "varchar", length: 50, comment: "이 컬럼은 국가명을 나타냅니다." })
  country_name: string;

  @OneToMany(() => DeliveryCosts, (deliveryCost) => deliveryCost.country)
  @JoinColumn()
  deliveryCosts: DeliveryCosts[];

  @OneToMany(() => Orders, (order) => order.country)
  orders: Orders[];
}
