import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserAuth } from './user-auth.entity';
import { UserAuthRepository } from './user-auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuth, UserAuthRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}






