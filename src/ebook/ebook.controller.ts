import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { ListarEbooksDto } from './ebook.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('ebooks')
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async listarEbooks(@Query() dto: ListarEbooksDto) {
    const { page = 1, itemsPerPage = 30, search } = dto;
    return this.ebookService.listarEbooks(page, itemsPerPage, search);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async obterEbookPorId(@Param('id') id: any) {
    const ebookId = parseInt(id, 10);
    return this.ebookService.obterEbookPorId(ebookId);
  }
}