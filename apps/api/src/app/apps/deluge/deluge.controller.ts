import { Controller, Get, Post } from '@nestjs/common';
import { DelugeService } from './deluge.service';
import { AppStatusResponse } from '../models/app-status.model';
import { AppActionResponse } from '../models/app-action.model';

@Controller('apps/deluge')
export class DelugeController {
  constructor(private readonly delugeService: DelugeService) {}

  @Get('status')
  getStatus(): Promise<AppStatusResponse> {
    return this.delugeService.getStatus();
  }

  @Post('start')
  start(): Promise<AppActionResponse> {
    return this.delugeService.start();
  }

  @Post('stop')
  stop(): Promise<AppActionResponse> {
    return this.delugeService.stop();
  }
}
