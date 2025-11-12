import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

class AuthSignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

class AuthSigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: AuthSignupDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('signin')
  async signin(@Body() body: AuthSigninDto) {
    return this.authService.signin(body.email, body.password);
  }
}
