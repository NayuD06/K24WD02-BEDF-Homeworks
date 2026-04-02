import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      username: user.username,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
      user: this.usersService.serializeUser(user),
    };
  }

  async getProfile(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token không hợp lệ hoặc người dùng không tồn tại.');
    }

    return this.usersService.serializeUser(user);
  }
}
