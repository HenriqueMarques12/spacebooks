import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('resenhas')
@UseInterceptors(CacheInterceptor)
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  @Get()
  async listarEbooks(
    @Query('page') page: number = 1,
    @Query('itemsPerPage') itemsPerPage: number = 10,
  ) {
    return this.ebookService.listarEbooks(page, itemsPerPage);
  }

  @Get(':id')
  async obterEbookPorId(@Param('id') id: string) {
    return this.ebookService.obterEbookPorId(+id);
  }
}
