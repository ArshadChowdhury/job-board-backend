import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });

    console.log(
      'JWT Strategy initialized with secret:',
      process.env.JWT_SECRET,
    ); 
  }

  async validate(payload: any) {
    console.log('JWT Strategy validating:', payload);
    const user = await this.authService.validateUser(payload);
    if (!user) {
      console.log('User validation failed'); 
      throw new UnauthorizedException('Invalid token');
    }

    console.log('User validated successfully:', user);
    return user;
  }
}
