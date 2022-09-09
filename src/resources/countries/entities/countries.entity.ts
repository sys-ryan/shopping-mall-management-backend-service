import { DeliveryCosts } from "../../delivery_costs/entities/delivery_costs.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "src/resources/orders/entities/orders.entity";

@Entity()
export class Countries {
  @PrimaryGeneratedColumn()
  country_index: number;

  @Column({ type: "int", name: "country_code", comment: "이 컬럼은 국가 코드를 나타냅니다." })
  countryCode: number;

  @Column({
    type: "varchar",
    name: "country_decode",
    length: 3,
    comment: "이 컬럼은 Country Dialing Code를 나타냅니다.",
  })
  countryDecode: string;

  @Column({
    type: "varchar",
    name: "country_name",
    length: 50,
    comment: "이 컬럼은 국가명을 나타냅니다.",
  })
  countryName: string;

  @OneToMany(() => DeliveryCosts, (deliveryCost) => deliveryCost.country)
  @JoinColumn()
  deliveryCosts: DeliveryCosts[];

  @OneToMany(() => Orders, (order) => order.country)
  orders: Orders[];
}
