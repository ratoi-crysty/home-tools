export interface AppStatusResponse {
  appId: string;
  running: boolean;
  pid: number | null;
  checkedAt: string;
}
