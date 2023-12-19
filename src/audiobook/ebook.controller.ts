import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { ListarEbooksDto } from './ebook.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('audiobooks')
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)

  async listarEbooks(@Query() dto: ListarEbooksDto) {
    const { page = 1, itemsPerPage = 30 } = dto;
    return this.ebookService.listarEbooks(page, itemsPerPage);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async obterEbookPorId(@Param('id') id: string) {
    const ebookId = parseInt(id, 10);
    return this.ebookService.obterEbookPorId(ebookId);
  }
 
}
