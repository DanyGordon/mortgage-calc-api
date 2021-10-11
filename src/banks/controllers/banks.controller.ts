import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { BanksService } from '../services/banks.service';

import { BankBodyDto } from '../dto/bank.body.dto';
import { BankUpdateDto } from '../dto/bankUpdate.dto';
import { RecordBodyDto } from '../dto/record.body.dto';

import { Bank } from 'src/domain/bank.entity';
import { Record } from 'src/domain/record.entity';
import { ValidationPipe } from 'src/pipes/dto-validation.pipe';

@Controller('banks')
export class BanksController {

  constructor(private bankService: BanksService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBanks(@Req() req: Request): Promise<Bank[] | HttpException> {
    return await this.bankService.findAllBanks({ token: req.headers.authorization.slice(7) });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addNewBank(@Req() req: Request, @Body(new ValidationPipe()) body: BankBodyDto): Promise<void | HttpException> {
    return await this.bankService.createNewBank(body, req.headers.authorization.slice(7));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBankById(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Bank | HttpException> {
    return await this.bankService.findBankById(id, req.headers.authorization.slice(7));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateBank(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) body: BankUpdateDto): Promise<Bank | HttpException> {
    return await this.bankService.updateBank(id, body, req.headers.authorization.slice(7));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBank(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<void | HttpException> {
    return await this.bankService.deleteBank(id, req.headers.authorization.slice(7));
  }

  @Get(':bankId/history')
  @UseGuards(JwtAuthGuard)
  async getAllRecords(@Req() req: Request, @Param('bankId', ParseIntPipe) bankId: number): Promise<Record[] | HttpException> {
    return await this.bankService.findAllRecords(req.headers.authorization.slice(7), bankId);
  }

  @Get(':bankId/history/:id')
  @UseGuards(JwtAuthGuard)
  async getRecord(@Req() req: Request, @Param('bankId', ParseIntPipe) bankId: number, @Param('id', ParseIntPipe) id: number): Promise<Record | HttpException> {
    return await this.bankService.findRecordById(req.headers.authorization.slice(7), bankId, id);
  }

  @Post(':bankId/history')
  @UseGuards(JwtAuthGuard)
  async createRecord(@Req() req: Request, @Param('bankId', ParseIntPipe) bankId: number, @Body(new ValidationPipe()) body: RecordBodyDto): Promise<void | HttpException> {
    return await this.bankService.createNewRecord(req.headers.authorization.slice(7), bankId, body);
  }

  @Delete(':bankId/history/:id')
  @UseGuards(JwtAuthGuard)
  async removeRecord(@Req() req: Request, @Param('bankId', ParseIntPipe) bankId: number, @Param('id', ParseIntPipe) id: number): Promise<void | HttpException> {
    return await this.bankService.removeRecordById(req.headers.authorization.slice(7), bankId, id);
  }
}