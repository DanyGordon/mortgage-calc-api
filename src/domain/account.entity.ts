import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bank } from "./bank.entity";

@Entity()
export class Account {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(type => Bank, bank => bank.user)
  banks: Bank[]
}