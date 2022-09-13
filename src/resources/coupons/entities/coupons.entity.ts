import { CouponTypes } from "src/resources/coupon_types/entities/coupon_types.entity";
import { Orders } from "src/resources/orders/entities/orders.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Coupons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    name: "coupon_code",
    length: 36,
    comment: "해당 컬럼은 쿠폰 코드를 나타냅니다.",
  })
  couponCode: string;

  @Column({ name: "is_used", default: false, comment: "해당 컬럼은 쿠폰 사용 여부를 나타냅니다." })
  isUsed: boolean;

  @CreateDateColumn({ name: "created_at", comment: "해당 컬럼은 쿠폰 생성 시간을 나타냅니다." })
  createdAt: Date;

  @Column({ name: "expires_at", comment: "해당 컬럼은 쿠폰 만료 시간을 나타냅니다." })
  expiresAt: Date;

  @Column({
    type: "decimal",
    precision: 8,
    scale: 2,
    comment: "해당 컬럼은 쿠폰 사용으로 실제 할인된 금액을 나타냅니다.",
    default: 0,
  })
  discountAmount: number;

  @ManyToOne(() => CouponTypes, (couponType) => couponType.coupons)
  @JoinColumn()
  couponType: CouponTypes;

  @OneToOne(() => Orders, (order) => order.coupon)
  @JoinColumn()
  order: Orders;
}
