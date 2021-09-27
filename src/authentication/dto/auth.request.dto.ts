import { IsEmail, IsString, Length } from "class-validator"

export class AuthRequestDto {
  @IsEmail()
  @Length(8)
  email: string

  @IsString()
  @Length(2)
  name: string

  @IsString()
  @Length(8, 30)
  password: string
}