import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll(): Promise<Job[]> {
    return this.jobRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async unhide(id: string): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ id });

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    job.hidden = false;
    return this.jobRepository.save(job);
  }

  async findAllVisible(): Promise<Job[]> {
    return this.jobRepository.find({
      where: { hidden: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['applications'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(createJobDto);
    return this.jobRepository.save(job);
  }

  async remove(id: string): Promise<void> {
    const job = await this.jobRepository.findOneBy({ id });

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    await this.jobRepository.remove(job);
  }

  async hide(id: string): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ id });

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    job.hidden = true;
    return this.jobRepository.save(job);
  }
}
