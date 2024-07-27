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
    @Query('itemsPerPage') itemsPerPage: number = 15,
    @Query('search') search?: string,
    @Query('categories') categories?: string,
  ) {
    const categoryNames = categories ? categories.split(',') : [];
    return this.ebookService.listarEbooks(page, itemsPerPage, search, categoryNames);
  }

  @Get(':id')
  async obterEbookPorId(@Param('id') id: string) {
    return this.ebookService.obterEbookPorId(+id);
  }
}
