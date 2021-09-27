import { BadRequestException, Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '../guards/local-auth.guard';

import { AuthenticationService } from '../services/authentication.service';

import { AuthRequestDto } from 'src/authentication/dto/auth.request.dto';
import { AuthResponseDto } from 'src/authentication/dto/auth.response.dto';

@Controller('auth')
export class AuthenticationController {

  constructor(private readonly AuthService: AuthenticationService) { }

  @Post()
  @UseGuards(LocalAuthGuard)
  async authenticateUser(@Body() body: AuthRequestDto): Promise<HttpException | AuthResponseDto> {
    return await this.AuthService.generateJwtTokenForUser(body);
  }
}