import { Countries } from "../../countries/entities/countries.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeliveryCosts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", comment: "해당 컬럼은 배송비를 결정하는 수량을 나타냅니다." })
  quantity: number;

  @Column({
    type: "decimal",
    precision: 8,
    scale: 2,
    comment: "해당 컬럼은 상품 수량에 따른 배송비를 나타냅니다.",
  })
  cost: number;

  @ManyToOne(() => Countries, (country) => country.deliveryCosts)
  country: Countries;
}
