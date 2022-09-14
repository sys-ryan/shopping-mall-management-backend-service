import { COUPONE_TYPE_ENUM } from "src/common/enums";
import { Coupons } from "src/resources/coupons/entities/coupons.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CouponTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, comment: "해당 컬럼은 쿠폰 타입의 이름을 나타냅니다." })
  name: string;

  @Column({ type: "enum", enum: COUPONE_TYPE_ENUM, comment: "해당 컬럼은 쿠폰의 타입을 나냅니다." })
  type: COUPONE_TYPE_ENUM;

  @Column({
    type: "decimal",
    name: "discount_value",
    precision: 8,
    scale: 2,
    comment: "해당 컬럼은 쿠폰의 할인 값을 나타냅니다.",
  })
  discountValue: number;

  @OneToMany(() => Coupons, (coupon) => coupon.couponType)
  coupons: Coupons[];
}
