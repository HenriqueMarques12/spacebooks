import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pdv } from './pdv.entity';
import { PdvService } from './pdv.service';
import { PdvController } from './pdv.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pdv])],
  providers: [PdvService],
  controllers: [PdvController],
})
export class PdvModule {}
