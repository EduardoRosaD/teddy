import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { randomBytes } from 'crypto';
import { User } from '../users/user.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepository: Repository<Url>,
  ) {}

  // Gera um shortCode aleatório (Base62-like)
  private generateShortCode(): string {
    return randomBytes(4).toString('base64').replace(/\W/g, '').slice(0, 6);
  }

  // Cria shortCode único e salva no banco
  private async createUniqueShortCode(
    originalUrl: string,
    user?: Partial<User>,
  ): Promise<Url> {
    const baseUrl: string | undefined = process.env.BASE_URL;

    if (!baseUrl) {
      const err: Error = new Error(
        'BASE_URL não está definida nas variáveis de ambiente',
      );
      throw err;
    }

    for (let i = 0; i < 5; i++) {
      const shortCode = this.generateShortCode();
      const exists = await this.urlsRepository.findOne({
        where: { shortCode },
      });
      if (exists) continue;

      const shortUrl = `${baseUrl}/${shortCode}`;

      const url = this.urlsRepository.create({
        originalUrl,
        shortCode,
        shortUrl,
        user: user ? (user as User) : null,
      });

      return this.urlsRepository.save(url);
    }

    throw new BadRequestException(
      'Não foi possível gerar shortCode único. Tente novamente.',
    );
  }

  // Cria uma URL encurtada
  async shorten(originalUrl: string, userId?: string) {
    if (!originalUrl) {
      throw new BadRequestException('originalUrl é obrigatório');
    }

    const user = userId ? ({ id: userId } as User) : null;
    const url = await this.createUniqueShortCode(
      originalUrl,
      user || undefined,
    );

    return {
      id: url.id,
      shortUrl: url.shortUrl,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
    };
  }

  async listUserUrls(userId: string) {
    return this.urlsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Atualiza o destino da URL
  async updateUrl(id: string, newOriginal: string) {
    const url = await this.urlsRepository.findOne({ where: { id } });
    if (!url) throw new NotFoundException('URL não encontrada');

    url.originalUrl = newOriginal;
    return this.urlsRepository.save(url);
  }

  // Exclui (soft delete)
  async deleteUrl(id: string) {
    const result = await this.urlsRepository.softDelete(id);
    if (result.affected === 0)
      throw new NotFoundException('URL não encontrada');
    return { ok: true };
  }

  // Busca pelo shortCode e incrementa contador
  async findByShortCodeAndCount(shortCode: string) {
    const url = await this.urlsRepository.findOne({ where: { shortCode } });
    if (!url) throw new NotFoundException('Short URL não encontrada');

    url.clicks = (url.clicks || 0) + 1;
    await this.urlsRepository.save(url);

    return url.originalUrl;
  }
}
