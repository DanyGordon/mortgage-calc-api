import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/domain/account.entity';
import { EncryptorModule } from 'src/encryptor/encryptor.module';
import { JwtConfiguratedModule } from 'src/jwt/jwt.module';
import { AccountController } from './controller/account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), EncryptorModule, JwtConfiguratedModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, TypeOrmModule]
})
export class AccountModule {}