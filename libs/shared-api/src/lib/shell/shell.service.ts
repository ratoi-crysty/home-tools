import { Injectable, Logger } from '@nestjs/common';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { ShellResult } from './models/shell-result.model';

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
      const execError: { stdout?: string; stderr?: string; code?: number } = error as {
        stdout?: string;
        stderr?: string;
        code?: number;
      };

      return {
        stdout: execError.stdout?.trim() ?? '',
        stderr: execError.stderr?.trim() ?? '',
        exitCode: execError.code ?? 1,
        success: false,
      };
    }
  }

  spawnDetached(command: string, args: string[] = []): void {
    this.logger.debug(`Spawning detached process: ${command} ${args.join(' ')}`);

    const child: ReturnType<typeof spawn> = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, DISPLAY: ':0' },
    });

    child.unref();
  }
}
