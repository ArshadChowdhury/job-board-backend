import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get('public')
  async findAll() {
    console.log('Getting all jobs - public route');
    return this.jobsService.findAllVisible();
  }

  @Get('admin')
  async getAllJobs() {
    return this.jobsService.findAll(); // no hidden filter
  }

  @Public()
  @Get('public/:id')
  async findOne(@Param('id') id: string) {
    console.log('Getting job by id - public route:', id);
    return this.jobsService.findOne(id);
  }

  @Post('admin/create')
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Patch('admin/:id/hide')
  async hideJob(@Param('id') id: string) {
    return this.jobsService.hide(id);
  }

  @Patch('admin/:id/unhide')
  async unhideJob(@Param('id') id: string) {
    return this.jobsService.unhide(id);
  }

  @Delete('admin/:id')
  async remove(@Param('id') id: string) {
    console.log('Deleting job by id - public route:', id);
    return this.jobsService.remove(id);
  }
}
