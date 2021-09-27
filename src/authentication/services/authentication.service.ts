import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/services/account.service';
import { EncryptorService } from 'src/encryptor/services/encryptor.service';

import { AuthResponseDto } from 'src/authentication/dto/auth.response.dto';

@Injectable()
export class AuthenticationService {

  constructor(private readonly JwtService: JwtService, 
    private readonly AccountService: AccountService, 
    private readonly EncryptionService: EncryptorService) { }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.AccountService.findUserByEmail(email);
      if (user) {
        return await this.EncryptionService.compare(password, user.password) ? { name: user.name, email: user.email, id: user.id } : false;
      }
    } catch(e) {
      return null;
    }
  }

  async generateJwtTokenForUser({ email }): Promise<HttpException | AuthResponseDto> {
    try {      
      const id = (await this.AccountService.findUserByEmail(email))?.['id'];
      if(id) {
        return { token: this.JwtService.sign({ sub: id }) };
      } else {
        return new NotFoundException;
      }
    } catch (err) {
      return new BadRequestException;
    }
  }
}