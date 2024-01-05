// venda.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaService } from './venda.service';
import { VendaController } from './venda.controller';
import { Venda } from './venda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venda])],
  providers: [VendaService],
  controllers: [VendaController],
})
export class VendaModule {}
