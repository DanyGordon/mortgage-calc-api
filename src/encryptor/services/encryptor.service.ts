import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { hash, genSalt, compare } from 'bcrypt'

@Injectable()
export class EncryptorService {
  
  constructor(private readonly ConfigService: ConfigService) { }

  async hash(plain: string): Promise<string> {
    const salt = await genSalt(this.ConfigService.get<number>('HASH_ROUNDS') | 10);
    return hash(plain, salt);
  }

  async compare(plain: string, encrypted: string): Promise<boolean> {
    return compare(plain, encrypted);
  }
}