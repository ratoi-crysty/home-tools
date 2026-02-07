import { Module } from '@nestjs/common';
import { ShellModule } from '@home-tools/shared-api';
import { AppsModule } from './apps/apps.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ShellModule, AppsModule, HealthModule],
})
export class AppModule {}
