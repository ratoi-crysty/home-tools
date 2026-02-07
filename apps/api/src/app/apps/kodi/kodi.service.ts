import { Injectable, Logger } from '@nestjs/common';
import { ShellService, SpawnResult } from '@home-tools/shared-api';
import { AppStatusResponse } from '../models/app-status.model';
import { AppActionResponse } from '../models/app-action.model';
import { KODI_APP_ID, KODI_PROCESS_NAME, KODI_EXECUTABLE } from './kodi.constants';

@Injectable()
export class KodiService {
  private readonly logger: Logger = new Logger(KodiService.name);

  constructor(private readonly shellService: ShellService) {}

  async getStatus(): Promise<AppStatusResponse> {
    const result: { stdout: string; success: boolean } = await this.shellService.execute(
      `pgrep -x ${KODI_PROCESS_NAME}`
    );

    const running: boolean = result.success;
    const pid: number | null = running ? parseInt(result.stdout.split('\n')[0], 10) : null;

    this.logger.debug(`Kodi status: running=${running}, pid=${pid}`);

    return {
      appId: KODI_APP_ID,
      running,
      pid,
      checkedAt: new Date().toISOString(),
    };
  }

  async start(): Promise<AppActionResponse> {
    const status: AppStatusResponse = await this.getStatus();

    if (status.running) {
      return {
        appId: KODI_APP_ID,
        action: 'start',
        success: false,
        message: 'Kodi is already running',
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.log('Starting Kodi');
    const spawnResult: SpawnResult = await this.shellService.spawnDetached(KODI_EXECUTABLE);

    if (!spawnResult.success) {
      this.logger.error(`Failed to start Kodi: ${spawnResult.error}`);
      return {
        appId: KODI_APP_ID,
        action: 'start',
        success: false,
        message: spawnResult.error ?? 'Failed to start Kodi',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      appId: KODI_APP_ID,
      action: 'start',
      success: true,
      message: 'Kodi started successfully',
      timestamp: new Date().toISOString(),
    };
  }

  async stop(): Promise<AppActionResponse> {
    const status: AppStatusResponse = await this.getStatus();

    if (!status.running) {
      return {
        appId: KODI_APP_ID,
        action: 'stop',
        success: false,
        message: 'Kodi is not running',
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.log('Stopping Kodi');
    const result: { success: boolean; error?: string } = await this.shellService.execute(
      `pkill -x ${KODI_PROCESS_NAME}`
    );

    return {
      appId: KODI_APP_ID,
      action: 'stop',
      success: result.success,
      message: result.success ? 'Kodi stopped successfully' : (result.error ?? 'Failed to stop Kodi'),
      timestamp: new Date().toISOString(),
    };
  }
}
