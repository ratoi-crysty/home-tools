export interface AppStatus {
  appId: string;
  running: boolean;
  pid: number | null;
  checkedAt: string;
}

export type AppAction = 'start' | 'stop';

export interface AppActionResult {
  appId: string;
  action: AppAction;
  success: boolean;
  message: string;
  timestamp: string;
}
