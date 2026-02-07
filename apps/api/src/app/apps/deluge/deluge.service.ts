import { Injectable, Logger } from '@nestjs/common';
import { ShellService, SpawnResult } from '@home-tools/shared-api';
import { AppStatusResponse } from '../models/app-status.model';
import { AppActionResponse } from '../models/app-action.model';
import { DELUGE_APP_ID, DELUGE_PROCESS_NAME, DELUGE_EXECUTABLE } from './deluge.constants';

@Injectable()
export class DelugeService {
  private readonly logger: Logger = new Logger(DelugeService.name);

  constructor(private readonly shellService: ShellService) {}

  async getStatus(): Promise<AppStatusResponse> {
    const result: { stdout: string; success: boolean } = await this.shellService.execute(
      `pgrep -x ${DELUGE_PROCESS_NAME}`
    );

    const running: boolean = result.success;
    const pid: number | null = running ? parseInt(result.stdout.split('\n')[0], 10) : null;

    this.logger.debug(`Deluge status: running=${running}, pid=${pid}`);

    return {
      appId: DELUGE_APP_ID,
      running,
      pid,
      checkedAt: new Date().toISOString(),
    };
  }

  async start(): Promise<AppActionResponse> {
    const status: AppStatusResponse = await this.getStatus();

    if (status.running) {
      return {
        appId: DELUGE_APP_ID,
        action: 'start',
        success: false,
        message: 'Deluge is already running',
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.log('Starting Deluge');
    const spawnResult: SpawnResult = await this.shellService.spawnDetached(DELUGE_EXECUTABLE);

    if (!spawnResult.success) {
      this.logger.error(`Failed to start Deluge: ${spawnResult.error}`);
      return {
        appId: DELUGE_APP_ID,
        action: 'start',
        success: false,
        message: spawnResult.error ?? 'Failed to start Deluge',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      appId: DELUGE_APP_ID,
      action: 'start',
      success: true,
      message: 'Deluge started successfully',
      timestamp: new Date().toISOString(),
    };
  }

  async stop(): Promise<AppActionResponse> {
    const status: AppStatusResponse = await this.getStatus();

    if (!status.running) {
      return {
        appId: DELUGE_APP_ID,
        action: 'stop',
        success: false,
        message: 'Deluge is not running',
        timestamp: new Date().toISOString(),
      };
    }

    this.logger.log('Stopping Deluge');
    const result: { success: boolean; error?: string } = await this.shellService.execute(
      `pkill -x ${DELUGE_PROCESS_NAME}`
    );

    return {
      appId: DELUGE_APP_ID,
      action: 'stop',
      success: result.success,
      message: result.success ? 'Deluge stopped successfully' : (result.error ?? 'Failed to stop Deluge'),
      timestamp: new Date().toISOString(),
    };
  }
}
