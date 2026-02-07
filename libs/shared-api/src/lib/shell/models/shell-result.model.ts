export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
  error?: string;
}

export interface SpawnResult {
  success: boolean;
  pid: number | null;
  error?: string;
}
