import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VendaService } from './venda.service';
import { Venda } from './venda.entity';

@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  create(@Body() vendaData: Partial<Venda>): Promise<Venda> {
    return this.vendaService.create(vendaData);
  }

  @Get()
  findAll(): Promise<Venda[]> {
    return this.vendaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Venda> {
    return this.vendaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Venda>): Promise<Venda> {
    return this.vendaService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.vendaService.remove(id);
  }
}
