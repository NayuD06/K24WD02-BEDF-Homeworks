import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './common/decorators/current-user.decorator';
import type { JwtPayload } from './jwt/jwt-payload.type';
import { Public } from './common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  profile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user);
  }
}
