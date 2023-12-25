import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PdvService } from './pdv.service';
import { Pdv } from './pdv.entity';

@Controller('pdvs')
export class PdvController {
  constructor(private readonly pdvService: PdvService) {}

  @Get()
  findAll(): Promise<Pdv[]> {
    return this.pdvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Pdv> {
    return this.pdvService.findOne(+id);
  }

  @Post()
  create(@Body() createPdvDto: Partial<Pdv>): Promise<Pdv> {
    return this.pdvService.create(createPdvDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePdvDto: Partial<Pdv>): Promise<Pdv> {
    return this.pdvService.update(+id, updatePdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.pdvService.remove(+id);
  }
}
