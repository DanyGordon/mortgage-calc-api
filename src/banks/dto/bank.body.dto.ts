import { IsNumber, IsString, Length, Max, Min } from "class-validator"

export class BankBodyDto {
  @IsString()
  @Length(4, 40)
  name: string

  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate: number

  @IsNumber()
  @Min(30000)
  @Max(4000000)
  maxLoan: number

  @IsNumber()
  @Min(0)
  @Max(100)
  minDownPaymentPercent: number

  @IsNumber()
  @Min(5)
  @Max(30)
  loanTerm: number

  @IsNumber()
  @Min(0)
  insurance: number

  @IsNumber()
  @Min(0)
  @Max(100)
  taxPercentPerYear: number

  @IsNumber()
  uid: number
}