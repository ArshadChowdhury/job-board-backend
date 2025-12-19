// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { LoginDto } from './dto/login.dto';

// @Injectable()
// export class AuthService {
//   constructor(private jwtService: JwtService) {}

//   async login(loginDto: LoginDto) {
//     const { username, password } = loginDto;

//     // Simple admin check
//     if (
//       username !== process.env.ADMIN_USERNAME ||
//       password !== process.env.ADMIN_PASSWORD
//     ) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const payload = {
//       username,
//       sub: 'admin',
//       role: 'admin', // Add role for extra validation
//     };

//     const token = this.jwtService.sign(payload);
//     console.log('Generated token:', token);

//     return {
//       access_token: token,
//       user: { username, role: 'admin' },
//     };
//   }

//   async validateUser(payload: any) {
//     // Simple validation - in a real app you'd query a user database
//     if (
//       payload.username === process.env.ADMIN_USERNAME &&
//       payload.role === 'admin'
//     ) {
//       return {
//         username: payload.username,
//         userId: payload.sub,
//         role: payload.role,
//       };
//     }
//     return null;
//   }
// }

// services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/repositories/user.repository';
import { LoginDto } from '../users/dto/login.dto';
// import { LoginDto } from '../dto/login.dto';
// import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Partial<User>; access_token: string }> {
    const { username, email, password, role } = createUserDto;

    // Check if user exists
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Partial<User>; access_token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async validateUser(payload: any): Promise<User | null> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  async refreshToken(userId: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
