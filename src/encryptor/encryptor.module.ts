import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptorService } from './services/encryptor.service';

@Module({
  providers: [EncryptorService, ConfigService],
  controllers: [],
  exports: [EncryptorService]
})
export class EncryptorModule {}
