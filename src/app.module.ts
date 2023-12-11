import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeormModule } from './typeorm/typeorm.module';
import { EbookModule } from './ebook/ebook.module';
import { AudiobookModule } from './audiobook/ebook.module';
import { ResenhaModule } from './resenhas/ebook.module';
import { CursoModule } from './cursos/ebook.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeormModule,
    EbookModule,
    AudiobookModule,
    ResenhaModule,
    CursoModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


