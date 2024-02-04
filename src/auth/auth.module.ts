import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserAuth } from './user-auth.entity';
import { UserAuthRepository } from './user-auth.repository';
import { LocalStrategy } from './local.strategy';
import { PdvModule } from 'src/pdv/pdv.module';

@Module({
  imports: [
    PdvModule,
    TypeOrmModule.forFeature([UserAuth, UserAuthRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}






