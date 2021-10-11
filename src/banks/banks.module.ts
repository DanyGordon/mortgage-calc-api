import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BanksController } from './controllers/banks.controller';
import { BanksService } from './services/banks.service';

import { JwtConfiguratedModule } from 'src/jwt/jwt.module';

import { Bank } from 'src/domain/bank.entity';
import { Record } from 'src/domain/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bank, Record]), JwtConfiguratedModule],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [TypeOrmModule]
})
export class BanksModule {}