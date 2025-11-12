import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'] as string | undefined;

    if (!authHeader) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (request as any).user = null;
      return true;
    }

    return super.canActivate(context);
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  handleRequest<TUser = User | null>(
    err: unknown,
    user: TUser,
    _info: unknown,
    _context: ExecutionContext,
    _status?: unknown,
  ): TUser {
    if (err) {
      console.warn('JWT inválido:', err);
    }
    // Retorna o usuário se autenticado, ou null
    return (user || null) as TUser;
  }
}
