import { Countries } from "src/resources/countries/entities/countries.entity";
import { Coupons } from "src/resources/coupons/entities/coupons.entity";
import { Users } from "src/resources/users/entities/users.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.orders)
  user: Users;

  @ManyToOne(() => Countries, (country) => country.orders)
  country: Countries;

  @OneToOne(() => Coupons, (coupon) => coupon.order)
  @JoinColumn()
  coupon: Coupons;
}
