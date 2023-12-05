import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormModule } from './typeorm/typeorm.module';
import { EbookModule } from './ebook/ebook.module';

@Module({
  imports: [
    TypeormModule,
    EbookModule,
    CacheModule.register({
      ttl: 5000,
      max: 500,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


