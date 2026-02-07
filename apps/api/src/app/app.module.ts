import { Module } from '@nestjs/common';
import { ShellModule } from '@home-tools/shared-api';
import { AppsModule } from './apps/apps.module';

@Module({
  imports: [ShellModule, AppsModule],
})
export class AppModule {}
