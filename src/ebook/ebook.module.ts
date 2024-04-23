import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ebook } from './ebook.entity';
import { EbookService } from './ebook.service';
import { EbookController } from './ebook.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ebook]),
    CacheModule.register({
      ttl: 3600,
      max: 500,
    }),
  ],
  providers: [EbookService],
  controllers: [EbookController],
})
export class EbookModule {}
