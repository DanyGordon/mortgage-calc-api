import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Bank } from "./bank.entity";

@Entity()
export class Record {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  bankname: string

  @Column()
  date: Date

  @Column({ type: "decimal", scale: 2 })
  total: number

  @Column({ type: "decimal", scale: 2 })
  basesum: number
  
  @Column({ type: "decimal", scale: 2, precision: 5 })
  tax: number

  @Column({ type: "decimal", scale: 2 })
  insurance: number

  @Column({ type: "decimal", scale: 2 })
  initialloan: number

  @Column({ type: "decimal", scale: 2 })
  imprest: number

  @Column({ type: "decimal", scale: 2, precision: 5 })
  imprestpercent: number

  @Column()
  term: number

  @Column({ type: "decimal", scale: 2, precision: 5 })
  interestrate: number

  @ManyToOne(type => Bank, bank => bank.records)
  bank: Bank
}