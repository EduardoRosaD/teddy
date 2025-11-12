import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

interface UpdateUserDto {
  email?: string;
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ cria novo usuário
  async create(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // ✅ encontra usuário por email (usado no AuthService)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  // ✅ encontra usuário por ID
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  // ✅ atualização de email e/ou senha
  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (data.email) {
      const existing = await this.userRepository.findOne({
        where: { email: data.email, deletedAt: IsNull() },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('E-mail já está em uso');
      }

      user.email = data.email;
    }

    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.save(user);
  }

  // ✅ soft delete
  async delete(id: string) {
    const user = await this.findById(id);

    user.deletedAt = new Date();

    await this.userRepository.save(user);

    return { message: 'Usuário excluído com sucesso (soft delete)' };
  }
}
