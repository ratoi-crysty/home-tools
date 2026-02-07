import { Injectable, Logger } from '@nestjs/common';
import { exec, spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { ShellResult, SpawnResult } from './models/shell-result.model';

const execAsync: (command: string) => Promise<{ stdout: string; stderr: string }> = promisify(exec);

@Injectable()
export class ShellService {
  private readonly logger: Logger = new Logger(ShellService.name);

  async execute(command: string): Promise<ShellResult> {
    this.logger.debug(`Executing command: ${command}`);

    try {
      const { stdout, stderr }: { stdout: string; stderr: string } = await execAsync(command);

      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0,
        success: true,
      };
    } catch (error: unknown) {
      const execError: { stdout?: string; stderr?: string; code?: number; message?: string } = error as {
        stdout?: string;
        stderr?: string;
        code?: number;
        message?: string;
      };

      this.logger.warn(`Command failed: ${command}, error: ${execError.message ?? 'Unknown error'}`);

      return {
        stdout: execError.stdout?.trim() ?? '',
        stderr: execError.stderr?.trim() ?? '',
        exitCode: execError.code ?? 1,
        success: false,
        error: execError.message,
      };
    }
  }

  spawnDetached(command: string, args: string[] = []): Promise<SpawnResult> {
    this.logger.debug(`Spawning detached process: ${command} ${args.join(' ')}`);

    return new Promise<SpawnResult>((resolve) => {
      try {
        const child: ChildProcess = spawn(command, args, {
          detached: true,
          stdio: 'ignore',
          env: { ...process.env, DISPLAY: ':0' },
        });

        child.on('error', (err: Error) => {
          this.logger.error(`Failed to spawn process: ${command}, error: ${err.message}`);
          resolve({
            success: false,
            pid: null,
            error: err.message,
          });
        });

        child.on('spawn', () => {
          this.logger.debug(`Process spawned successfully: ${command}, pid: ${child.pid}`);
          child.unref();
          resolve({
            success: true,
            pid: child.pid ?? null,
          });
        });
      } catch (error: unknown) {
        const err: Error = error as Error;
        this.logger.error(`Failed to spawn process: ${command}, error: ${err.message}`);
        resolve({
          success: false,
          pid: null,
          error: err.message,
        });
      }
    });
  }
}
