import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppStatus, AppActionResult } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = '/api/apps';

  getDelugeStatus(): Observable<AppStatus> {
    return this.http.get<AppStatus>(`${this.baseUrl}/deluge/status`);
  }

  startDeluge(): Observable<AppActionResult> {
    return this.http.post<AppActionResult>(`${this.baseUrl}/deluge/start`, {});
  }

  stopDeluge(): Observable<AppActionResult> {
    return this.http.post<AppActionResult>(`${this.baseUrl}/deluge/stop`, {});
  }

  getKodiStatus(): Observable<AppStatus> {
    return this.http.get<AppStatus>(`${this.baseUrl}/kodi/status`);
  }

  startKodi(): Observable<AppActionResult> {
    return this.http.post<AppActionResult>(`${this.baseUrl}/kodi/start`, {});
  }

  stopKodi(): Observable<AppActionResult> {
    return this.http.post<AppActionResult>(`${this.baseUrl}/kodi/stop`, {});
  }
}
