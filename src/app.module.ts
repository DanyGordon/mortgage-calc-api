import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { AuthenticationModule } from './authentication/authentication.module';
import { BanksModule } from './banks/banks.module';
import { EncryptorModule } from './encryptor/encryptor.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';

import jwtConstants from './configuration/jwt.constants';

import { Account } from './domain/account.entity';
import { Bank } from './domain/bank.entity';
import { Record } from './domain/record.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'test',
      entities: [Account, Bank, Record],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConstants]
    }),
    AuthenticationModule, 
    BanksModule, 
    EncryptorModule, AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
