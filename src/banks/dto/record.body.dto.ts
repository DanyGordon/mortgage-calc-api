import { IsDate, IsDateString, IsNumber, IsString, Length, Max, Min } from "class-validator"

export class RecordBodyDto {
  @IsString()
  @Length(4, 40)
  bankname: string

  @IsDateString()
  date: string

  @IsNumber()
  @Min(0)
  total: number

  @IsNumber()
  @Min(0)
  basesum: number

  @IsNumber()
  @Min(0)
  @Max(100)
  tax: number

  @IsNumber()
  @Min(0)
  insurance: number

  @IsNumber()
  @Min(70000)
  @Max(4000000)
  initialloan: number

  @IsNumber()
  @Min(0)
  imprest: number

  @IsNumber()
  @Min(0)
  @Max(100)
  imprestpercent: number

  @IsNumber()
  @Min(5)
  @Max(30)
  term: number

  @IsNumber()
  @Min(0)
  @Max(100)
  interestrate: number
}