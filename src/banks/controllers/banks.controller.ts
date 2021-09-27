import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';

import { BanksService } from '../services/banks.service';

import { BankRequestDto } from '../dto/bank.request.dto';
import { BankUpdateRequestDto } from '../dto/bankUpdate.request.dto';
import { Request } from 'express';
import { RecordBodyDto } from '../dto/record.body.dto';

@Controller('banks')
export class BanksController {

  constructor(private bankService: BanksService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBanks(@Req() req: Request): Promise<any> {
    return await this.bankService.findAllBanks({ token: req.headers.authorization.slice(7) });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addNewBank(@Req() req: Request, @Body() body: BankRequestDto): Promise<any> {
    return await this.bankService.createNewBank(body, req.headers.authorization.slice(7));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBankById(@Req() req: Request, @Param('id') id: number): Promise<any> {
    return await this.bankService.findBankById(id, req.headers.authorization.slice(7));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateBank(@Req() req: Request, @Param('id') id: number, @Body() body: BankUpdateRequestDto): Promise<any> {
    return await this.bankService.updateBank(id, body, req.headers.authorization.slice(7));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBank(@Req() req: Request, @Param('id') id: number): Promise<any> {
    return await this.bankService.deleteBank(id, req.headers.authorization.slice(7));
  }

  @Get(':bankId/history')
  @UseGuards(JwtAuthGuard)
  async getAllRecords(@Req() req: Request, @Param('bankId') bankId: number): Promise<any> {
    return await this.bankService.findAllRecords(req.headers.authorization.slice(7), bankId);
  }

  @Get(':bankId/history/:id')
  @UseGuards(JwtAuthGuard)
  async getRecord(@Req() req: Request, @Param('bankId') bankId: number, @Param('id') id: number): Promise<any> {
    return await this.bankService.findRecordById(req.headers.authorization.slice(7), bankId, id);
  }

  @Post(':bankId/history')
  @UseGuards(JwtAuthGuard)
  async createRecord(@Req() req: Request, @Param('bankId') bankId: number, @Body() body: RecordBodyDto): Promise<any> {
    return await this.bankService.createNewRecord(req.headers.authorization.slice(7), bankId, body);
  }

  @Delete(':bankId/history/:id')
  @UseGuards(JwtAuthGuard)
  async removeRecord(@Req() req: Request, @Param('bankId') bankId: number, @Param('id') id: number): Promise<any> {
    return await this.bankService.removeRecordById(req.headers.authorization.slice(7), bankId, id);
  }
}