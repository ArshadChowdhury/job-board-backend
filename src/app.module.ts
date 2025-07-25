import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 10, ttl: 5 * 1000 }],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    JobsModule,
    ApplicationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
