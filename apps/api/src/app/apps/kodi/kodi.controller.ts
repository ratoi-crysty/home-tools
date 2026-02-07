import { Controller, Get, Post } from '@nestjs/common';
import { KodiService } from './kodi.service';
import { AppStatusResponse } from '../models/app-status.model';
import { AppActionResponse } from '../models/app-action.model';

@Controller('apps/kodi')
export class KodiController {
  constructor(private readonly kodiService: KodiService) {}

  @Get('status')
  getStatus(): Promise<AppStatusResponse> {
    return this.kodiService.getStatus();
  }

  @Post('start')
  start(): Promise<AppActionResponse> {
    return this.kodiService.start();
  }

  @Post('stop')
  stop(): Promise<AppActionResponse> {
    return this.kodiService.stop();
  }
}
