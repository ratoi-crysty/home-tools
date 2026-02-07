export type AppAction = 'start' | 'stop';

export interface AppActionResponse {
  appId: string;
  action: AppAction;
  success: boolean;
  message: string;
  timestamp: string;
}
