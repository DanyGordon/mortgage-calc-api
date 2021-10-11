import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Bank } from 'src/domain/bank.entity';
import { Record } from 'src/domain/record.entity';
import { BankBodyDto } from '../dto/bank.body.dto';
import { BankUpdateDto } from '../dto/bankUpdate.dto';
import { RecordBodyDto } from '../dto/record.body.dto';

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
        return await this.BankRepository.find({ where: { user: id }, order: { id: 'DESC' } });
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }

  async findBankById(id: number, token: string): Promise<Bank | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      const bank = (await this.BankRepository.find({ where: { id }, relations: ["user"] }))[0];
      if(!bank) {
        throw new NotFoundException(`Bank with id ${id} non exist`);
      }
      if(bank.user.id !== +userId) {
        throw new ForbiddenException();
      }
      return bank;
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }
  
  async createNewBank(body: BankBodyDto, token: string): Promise<void | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = new Bank();
      Object.keys(body).forEach(field => body[field] ? bank[field] = body[field] : null);
      if(!bank.user) {
        bank.user = userId;
      }
      await this.BankRepository.insert(bank);
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new ConflictException();
      }
    }
  }
  
  async updateBank(id: number, body: BankUpdateDto, token: string): Promise<Bank | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = (await this.BankRepository.find({ where: { id }, relations: ["user"] }))[0];
      if(bank) {
        if(bank.user.id !== +userId) {
          throw new ForbiddenException();
        }
        Object.keys(bank).forEach(field => body[field] ? bank[field] = body[field] : null);
        return await this.BankRepository.save(bank);
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }

  async deleteBank(id: number, token: string): Promise<void | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = (await this.BankRepository.find({ where: { id }, relations: ["user"] }))[0];
      if(bank) {
        if(bank.user.id !== +userId) {
          throw new ForbiddenException();
        }
        await this.BankRepository.delete(id);
      }
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }
  
  async findAllRecords(token: string, bankId: number): Promise<Record[] | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        throw new ForbiddenException();
      }
      const records = await this.RecordRepository.find({ where: { bank: bankId }, order: { date: 'DESC' } });
      return records;
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }
  
  async findRecordById(token: string, bankId: number, id: number): Promise<Record | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        throw new ForbiddenException();
      }
      const records = await this.RecordRepository.find({ where: { bank: bankId } });
      const record = records.find(rec => rec.id === +id);
      if(record) {
        return record;
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }
  
  async createNewRecord(token: string, bankId: number, body: RecordBodyDto): Promise<void | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        throw new ForbiddenException();
      }
      const record = new Record();
      Object.keys(body).forEach(field => body[field] ? record[field] = body[field] : null);
      if(record.imprestpercent < +bank.minDownPaymentPercent || 
        record.imprest < Math.floor(record.initialloan * +bank.minDownPaymentPercent / 100)) {

          throw new BadRequestException();
      }
      record.bank = bank;
      await this.RecordRepository.insert(record);
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }
  
  async removeRecordById(token: string, bankId: number, id: number): Promise<void | HttpException> {
    try {
      const userId = this.JwtService.decode(token)['sub'];
      if(!userId) {
        throw new UnauthorizedException();
      }
      const bank = (await this.BankRepository.find({ where: { id: bankId }, relations: ["user"] }))[0];
      if(bank.user.id !== +userId) {
        throw new ForbiddenException();
      }
      const records = await this.RecordRepository.find({ where: { bank: bankId } });
      const record = records.find(rec => rec.id === +id);
      if(record) {
        this.RecordRepository.delete(id);
      }
    } catch (err) {
      if(err instanceof HttpException) {
        throw err;
      } else {
        throw new BadRequestException();
      }
    }
  }
}
