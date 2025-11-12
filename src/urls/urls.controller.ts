import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { IsString, IsUrl } from 'class-validator';
import { Response } from 'express';

class ShortenDto {
  @IsString()
  @IsUrl({ require_tld: false }) // aceita localhost também
  originalUrl: string;
}

class UpdateDto {
  @IsString()
  @IsUrl({ require_tld: false })
  url: string;
}

interface JwtPayload {
  userId: string; // ou number, dependendo da sua entidade
  email: string;
}

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  // Encurtar: aceita com ou sem autenticação
  @UseGuards(OptionalAuthGuard)
  @Post('urls')
  async shorten(
    @Body() body: ShortenDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    console.log(req.user);
    const userId = req.user ? req.user.userId : undefined;
    return this.urlsService.shorten(body.originalUrl, userId);
  }

  // Listar URLs do usuário
  @UseGuards(AuthGuard('jwt'))
  @Get('urls')
  async list(@Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.userId;
    return this.urlsService.listUserUrls(userId);
  }

  // Atualizar originalUrl
  @UseGuards(AuthGuard('jwt'))
  @Patch('urls/:id')
  async update(@Param('id') id: string, @Body() body: UpdateDto) {
    return this.urlsService.updateUrl(id, body.url);
  }

  // Deletar (soft delete)
  @UseGuards(AuthGuard('jwt'))
  @Delete('urls/:id')
  async remove(@Param('id') id: string) {
    return this.urlsService.deleteUrl(id);
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const original = await this.urlsService.findByShortCodeAndCount(shortCode);
    return res.redirect(302, original);
  }
}
