import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Job } from '../modules/jobs/entities/job.entity';
import { Application } from '../modules/applications/entities/application.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  // host: process.env.DATABASE_HOST || 'localhost',
  url: process.env.DATABASE_URL,
  port: parseInt(process.env.DATABASE_PORT ?? '5432') || 5432,
  autoLoadEntities: true,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'job-board',
  entities: [Job, Application],
  synchronize: process.env.NODE_ENV === 'development', // Only in development
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
