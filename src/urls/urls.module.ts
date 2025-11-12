import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UrlsRepository } from './repository/urls.repository';
import { Url } from './url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  providers: [UrlsService, UrlsRepository],
  controllers: [UrlsController],
})
export class UrlsModule {}
