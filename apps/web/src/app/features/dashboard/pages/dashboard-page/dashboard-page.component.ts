import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, interval, switchMap, takeUntil, catchError, of, tap } from 'rxjs';
import { AppCardComponent } from '../../components/app-card/app-card.component';
import { AppsService } from '../../services/apps.service';
import { AppStatus } from '../../models/app.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, AppCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private readonly appsService: AppsService = inject(AppsService);
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly POLL_INTERVAL = 5000;

  readonly kodiStatus = signal<AppStatus | null>(null);
  readonly kodiLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchKodiStatus();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startPolling(): void {
    interval(this.POLL_INTERVAL)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.appsService.getKodiStatus()),
        catchError((err: unknown) => {
          console.error('Failed to fetch Kodi status:', err);
          return of(null);
        })
      )
      .subscribe((status: AppStatus | null) => {
        if (status) {
          this.kodiStatus.set(status);
          this.error.set(null);
        }
      });
  }

  private fetchKodiStatus(): void {
    this.appsService
      .getKodiStatus()
      .pipe(
        catchError((err: unknown) => {
          console.error('Failed to fetch Kodi status:', err);
          this.error.set('Failed to connect to server');
          return of(null);
        })
      )
      .subscribe((status: AppStatus | null) => {
        if (status) {
          this.kodiStatus.set(status);
          this.error.set(null);
        }
      });
  }

  onKodiToggle(): void {
    const isRunning: boolean = this.kodiStatus()?.running ?? false;
    this.kodiLoading.set(true);

    const action$ = isRunning
      ? this.appsService.stopKodi()
      : this.appsService.startKodi();

    action$
      .pipe(
        tap(() => {
          setTimeout(() => this.fetchKodiStatus(), 500);
        }),
        catchError((err: unknown) => {
          console.error('Failed to toggle Kodi:', err);
          this.error.set('Failed to toggle Kodi');
          return of(null);
        })
      )
      .subscribe(() => {
        this.kodiLoading.set(false);
      });
  }
}
