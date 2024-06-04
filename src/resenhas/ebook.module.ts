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
      ttl: 7200, // Time to live in seconds (2 hours)
      max: 500, // Maximum number of items in cache
    }),
  ],
  providers: [EbookService],
  controllers: [EbookController],
})
export class ResenhaModule {}
