import { PAY_STATE_ENUM } from "src/common/enums";
import { Countries } from "src/resources/countries/entities/countries.entity";
import { Coupons } from "src/resources/coupons/entities/coupons.entity";
import { Deliveries } from "src/resources/deliveries/entities/deliveries.entity";
import { Users } from "src/resources/users/entities/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    name: "pay_state",
    enum: PAY_STATE_ENUM,
    default: PAY_STATE_ENUM.IN_PROGRESS,
    comment: "해당 컬럼은 주문에 대한 결제 완료 여부를 나타냅니다.",
  })
  payState: PAY_STATE_ENUM;

  @Column({ type: "int", comment: "해당 컬럼은 주문한 상품의 개수를 나타냅니다." })
  quantity: number;

  @Column({
    type: "decimal",
    name: "original_price",
    precision: 8,
    scale: 2,
    comment: "해당 컬럼은 할인 전 상품의 가격을 나타냅니다.",
  })
  originalPrice: number;

  @Column({
    type: "decimal",
    name: "discounted_price",
    precision: 8,
    scale: 2,
    comment: "해당 컬럼은 상품 할인 쿠폰을 적용했을 경우 할인되는 금액을 나타냅니다.",
    default: 0,
  })
  discountedPrice: number;

  @Column({
    type: "decimal",
    name: "final_price",
    precision: 8,
    scale: 2,
    default: 0,
    comment:
      "해당 컬럼은 상품할인 쿠폰을 적용했을 경우, 주문자가 지불해야할 상품의 금액을 나타냅니다.",
  })
  finalPrice: number;

  @Column({
    type: "decimal",
    name: "total_price",
    precision: 8,
    scale: 2,
    default: 0,
    comment:
      "해당 컬럼은 상품할인 또는 배송비 할인이 적용된 상품 가격과 배송비를 모두 합한 가격을 나타냅니다.",
  })
  totalPrice: number;

  @Column({
    type: "varchar",
    name: "buyr_zipx",
    length: 20,
    comment: "해당 컬럼은 배송지 우편번호를 나타냅니다.",
  })
  buyrZipx: string;

  @Column({
    type: "varchar",
    name: "buyr_city",
    length: 50,
    comment: "해당 컬럼은 배송지 도시를 나타냅니다.",
  })
  buyrCity: string;

  @Column({ type: "int", comment: "해당 컬럼은 vccode를 나타냅니다." })
  vccode: number;

  @CreateDateColumn({ name: "created_at", comment: "해당 컬럼은 주문이 생성된 시간을 나타냅니다." })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    comment: "해당 컬럼은 주문이 수정된 시간을 나타냅니다.",
  })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.orders)
  user: Users;

  @ManyToOne(() => Countries, (country) => country.orders)
  country: Countries;

  @OneToOne(() => Coupons, (coupon) => coupon.order)
  @JoinColumn()
  coupon: Coupons;

  @OneToOne(() => Deliveries, (delivery) => delivery.order)
  delivery: Deliveries;
}
