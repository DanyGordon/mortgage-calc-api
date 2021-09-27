import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EncryptorService } from 'src/encryptor/services/encryptor.service';
import { UserResponseDto } from '../dto/account.user.response.dto';

import { Account } from 'src/domain/account.entity';

@Injectable()
export class AccountService {
  
  constructor(private readonly JwtService: JwtService, 
    private readonly EncryptorService: EncryptorService,
    @InjectRepository(Account)
    private readonly AccountRepository: Repository<Account>) { }

  async findUserByEmail(email: string) {
    try {
      const user = (await this.AccountRepository.find({ where: { "email": email } }))[0];
      if(user) {
        return user;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async findUserByToken({ token }): Promise<any> {
    try {
      const id = this.JwtService.decode(token.trim())['sub'];
      const user = await this.AccountRepository.findOne(id);
      if(!user) {
        return new NotFoundException;
      }
      return { id: user.id, name: user.name, email: user.email };
    } catch (err) {
      return new BadRequestException;
    }
  }

  async registerNewUser({ email, name, password }): Promise<UserResponseDto | any> {
    try {
      const user = new Account();
      user.email = email;
      user.name = name;
      user.password = await this.EncryptorService.hash(password);
      await this.AccountRepository.insert(user);
    } catch (err) {
      return new BadRequestException;
    }
  }

  async validateJwt({ token }) {
    try {
      return await this.JwtService.verifyAsync(token) ? { uid: (this.JwtService.decode(token))['sub'], status: true } : UnauthorizedException;
    } catch (err) {
      return new BadRequestException;
    }
  }
}