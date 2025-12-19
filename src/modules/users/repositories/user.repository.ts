import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { username, isActive: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email, isActive: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    await this.userRepo.update(id, updateData);
    return await this.findById(id);
  }
}
