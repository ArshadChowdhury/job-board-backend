import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Simple admin check
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username,
      sub: 'admin',
      role: 'admin', // Add role for extra validation
    };

    const token = this.jwtService.sign(payload);
    console.log('Generated token:', token);

    return {
      access_token: token,
      user: { username, role: 'admin' },
    };
  }

  async validateUser(payload: any) {
    // Simple validation - in a real app you'd query a user database
    if (
      payload.username === process.env.ADMIN_USERNAME &&
      payload.role === 'admin'
    ) {
      return {
        username: payload.username,
        userId: payload.sub,
        role: payload.role,
      };
    }
    return null;
  }
}
