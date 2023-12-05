// ebook.controller.ts
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { ListarEbooksDto } from './ebook.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('resenhas')
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)

  async listarEbooks(@Query() dto: ListarEbooksDto) {
    const { page = 1, itemsPerPage = 30 } = dto;
    return this.ebookService.listarEbooks(page, itemsPerPage);
  }
}
