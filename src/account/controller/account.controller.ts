import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/dto-validation.pipe';
import { UserRequestDto } from '../dto/account.user.request.dto';
import { UserResponseDto } from '../dto/account.user.response.dto';

import { AccountService } from '../services/account.service';

@Controller('account')
export class AccountController {

  constructor(private readonly AccountService: AccountService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async getUserAccount(@Req() req: Request): Promise<UserResponseDto | any> {
    return await this.AccountService.findUserByToken({ token: req.headers.authorization.slice(7) || '' });
  }

  @Post('register')
  async createNewUser(@Body(new ValidationPipe()) body: UserRequestDto): Promise<UserResponseDto | any> {
    return await this.AccountService.registerNewUser(body);
  }

  @Get('validateJWT')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Req() req: Request): Promise<any> {
    return await this.AccountService.updateJwt({ token: req.headers.authorization.slice(7) });
  }
}
