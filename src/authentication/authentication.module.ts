import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtConfiguratedModule } from 'src/jwt/jwt.module';
import { EncryptorModule } from 'src/encryptor/encryptor.module';
import { AccountModule } from 'src/account/account.module';

import { AuthenticationController } from './controllers/authentication.controller';

import { AuthenticationService } from './services/authentication.service';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [EncryptorModule, AccountModule, PassportModule, JwtConfiguratedModule],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, ConfigService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, JwtConfiguratedModule]
})
export class AuthenticationModule {}
