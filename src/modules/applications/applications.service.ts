import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    // Check if job exists
    const job = await this.jobRepository.findOne({
      where: { id: createApplicationDto.jobId },
    });

    if (!job) {
      throw new NotFoundException(
        `Job with ID ${createApplicationDto.jobId} not found`,
      );
    }

    const application = this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find();
  }
}
