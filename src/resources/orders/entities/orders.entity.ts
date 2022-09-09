import { Countries } from "src/resources/countries/entities/countries.entity";
import { Users } from "src/resources/users/entities/users.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.orders)
  user: Users;

  @ManyToOne(() => Countries, (country) => country.orders)
  country: Countries;
}
