import { Module } from '@nestjs/common';
import { ShellModule } from '@home-tools/shared-api';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppsModule } from './apps/apps.module';

@Module({
  imports: [ShellModule, AppsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
