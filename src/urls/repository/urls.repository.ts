import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from '../url.entity';

@Injectable()
export class UrlsRepository {
  constructor(
    @InjectRepository(Url)
    private repo: Repository<Url>,
  ) {}

  createUrl(data: Partial<Url>) {
    const url = this.repo.create(data);
    return this.repo.save(url);
  }

  findByShortUrl(code: string) {
    return this.repo.findOne({ where: { shortUrl: code } });
  }

  findByUser(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  deleteUrl(id: string) {
    return this.repo.delete(id);
  }
}
