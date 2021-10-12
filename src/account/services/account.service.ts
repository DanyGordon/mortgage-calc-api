import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EncryptorService } from 'src/encryptor/services/encryptor.service';
import { UserResponseDto } from '../dto/account.user.response.dto';

import { Account } from 'src/domain/account.entity';
import { ValidateResponseDto } from '../dto/account.validate.response.dto';
import { isJWT } from 'class-validator';

@Injectable()
export class AccountService {
  
  constructor(private readonly JwtService: JwtService, 
    private readonly EncryptorService: EncryptorService,
    @InjectRepository(Account)
    private readonly AccountRepository: Repository<Account>) { }

  async findUserByEmail(email: string): Promise<Account> {
    try {
      const user = (await this.AccountRepository.find({ where: { "email": email } }))[0];
      if(user) {
        return user;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async findUserByToken({ token }): Promise<UserResponseDto | HttpException> {
    try {
      const id = this.JwtService.decode(token)['sub'];
      const user = await this.AccountRepository.findOne(id);
      if(!user) {
        throw new NotFoundException();
      }
      return { id: user.id, name: user.name, email: user.email };
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }

  async registerNewUser({ email, name, password }): Promise<void | HttpException> {
    try {
      const user = new Account();
      user.email = email;
      user.name = name;
      user.password = await this.EncryptorService.hash(password);
      await this.AccountRepository.insert(user);
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new ConflictException('Email must be unique and password must be long enough');
      }
    }
  }

  async updateJwt({ token }): Promise<ValidateResponseDto | HttpException> {
    try {
      if(token && isJWT(token)) {
        return { uid: +(this.JwtService.decode(token))['sub'], status: true };
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException('Invalid JWT token');
      }
    }
  }
}
