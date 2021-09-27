import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Bank } from 'src/domain/bank.entity';
import { Record } from 'src/domain/record.entity';

@Injectable()
export class BanksService {

  constructor(@InjectRepository(Bank) 
    private readonly BankRepository: Repository<Bank>,
    @InjectRepository(Record) 
    private readonly RecordRepository: Repository<Record>,
    private readonly JwtService: JwtService) { }

  async findAllBanks({ token }): Promise<Bank[] | HttpException> {
    try {
      const id = this.JwtService.decode(token)['sub'];
      if(id) {
        return await this.BankRepository.find({ where: { user: id } });
      } else {
        return new UnauthorizedException;
      }
    } catch (err) {
      return new BadRequestException;
    }
  }

  async findBankById(id: number, token: string): Promise<Bank | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      const bank = (await this.BankRepository.find({ where: { id }, relations: ["user"] }))[0];
      if(!bank) {
        return new NotFoundException;
      }
      if(bank.user.id !== +userId) {
        return new ForbiddenException;
      }
      return bank;
    } catch (err) {
      return new BadRequestException;
    }
  }

  async createNewBank(body, token: string): Promise<any> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = new Bank();
      Object.keys(body).forEach(field => body[field] ? bank[field] = body[field] : null);
      if(!bank.user) {
        bank.user = userId;
      }
      await this.BankRepository.insert(bank);
    } catch (err) {
      console.log(err);
      return new ConflictException;
    }
  }

  async updateBank(id: number, body, token: string) {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = (await this.BankRepository.find({ where: { id }, relations: ["user"] }))[0];
      if(bank) {
        if(bank.user.id !== +userId) {
          return new ForbiddenException;
        }
        Object.keys(bank).forEach(field => body[field] ? bank[field] = body[field] : null);
        await this.BankRepository.save(bank);
      } else {
        return new NotFoundException;
      }
    } catch (err) {
      return new BadRequestException;
    }
  }

  async deleteBank(id: number, token: string): Promise<any> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = (await this.BankRepository.find({ where: { id }, relations: ["user"] }))[0];
      if(bank) {
        if(bank.user.id !== +userId) {
          return new ForbiddenException;
        }
        await this.BankRepository.delete(id);
      }
    } catch (err) {
      return new BadRequestException;
    }
  }

  async findAllRecords(token: string, bankId: number) {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        return new ForbiddenException;
      }
      const records = await this.RecordRepository.find({ where: { bank: bankId } });
      return records;
    } catch (err) {
      console.log(err);
      return new BadRequestException;
    }
  }

  async findRecordById(token: string, bankId: number, id: number) {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        return new ForbiddenException;
      }
      const records = await this.RecordRepository.find({ where: { bank: bankId } });
      const record = records.find(rec => rec.id === +id);
      if(record) {
        return record;
      } else {
        return new NotFoundException;
      }
    } catch (err) {
      console.log(err);
      return new BadRequestException;
    }
  }

  async createNewRecord(token: string, bankId: number, body) {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        return new ForbiddenException;
      }
      const record = new Record();
      Object.keys(body).forEach(field => body[field] ? record[field] = body[field] : null);
      if(record.imprestpercent < +bank.minDownPaymentPercent) {
        return new BadRequestException;
      }
      record.bank = bank;
      await this.RecordRepository.insert(record);
    } catch (err) {
      console.log(err);
    }
  }

  async removeRecordById(token: string, bankId: number, id: number) {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        return new UnauthorizedException;
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        return new ForbiddenException;
      }
      const records = await this.RecordRepository.find({ where: { bank: bankId } });
      const record = records.find(rec => rec.id === +id);
      if(record) {
        this.RecordRepository.delete(id);
      }
    } catch (err) {
      console.log(err);
      return new BadRequestException;
    }
  }
}