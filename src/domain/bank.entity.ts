import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Record } from "./record.entity";

@Entity()
export class Bank {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column({ type: "decimal", scale: 2, precision: 5 })
  interestRate: number

  @Column()
  maxLoan: number

  @Column({ type: "decimal", scale: 2, precision: 5 })
  minDownPaymentPercent: number

  @Column()
  loanTerm: number

  @Column()
  insurance: number

  @Column({ type: "decimal", scale: 2, precision: 5 })
  taxPercentPerYear: number

  @ManyToOne(type => Account, account => account.banks)
  @JoinColumn()
  user: Account

  @OneToMany(type => Record, record => record.bank)
  records: Record[]
}