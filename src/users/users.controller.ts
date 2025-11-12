import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Delete,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

// DTO opcional para atualização
class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}

interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Retorna os dados do usuário autenticado
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // Retorna informações específicas de um usuário
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  // Atualiza email e/ou senha
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateUser(@Body() body: UpdateUserDto, @Req() req: AuthRequest) {
    return this.usersService.update(req.user.sub, body);
  }

  // Exclusão lógica (soft delete)
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteUser(@Req() req: AuthRequest) {
    return this.usersService.delete(req.user.sub);
  }
}
