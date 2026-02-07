import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, interval, takeUntil, catchError, of, tap, forkJoin } from 'rxjs';
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

  readonly delugeStatus = signal<AppStatus | null>(null);
  readonly delugeLoading = signal<boolean>(false);
  readonly kodiStatus = signal<AppStatus | null>(null);
  readonly kodiLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchAllStatuses();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startPolling(): void {
    interval(this.POLL_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchAllStatuses();
      });
  }

  private fetchAllStatuses(): void {
    forkJoin({
      deluge: this.appsService.getDelugeStatus().pipe(catchError(() => of(null))),
      kodi: this.appsService.getKodiStatus().pipe(catchError(() => of(null))),
    })
      .pipe(
        catchError((err: unknown) => {
          console.error('Failed to fetch app statuses:', err);
          this.error.set('Failed to connect to server');
          return of({ deluge: null, kodi: null });
        })
      )
      .subscribe((statuses: { deluge: AppStatus | null; kodi: AppStatus | null }) => {
        if (statuses.deluge) {
          this.delugeStatus.set(statuses.deluge);
        }
        if (statuses.kodi) {
          this.kodiStatus.set(statuses.kodi);
        }
        if (statuses.deluge || statuses.kodi) {
          this.error.set(null);
        }
      });
  }

  onDelugeToggle(): void {
    const isRunning: boolean = this.delugeStatus()?.running ?? false;
    this.delugeLoading.set(true);

    const action$ = isRunning
      ? this.appsService.stopDeluge()
      : this.appsService.startDeluge();

    action$
      .pipe(
        tap(() => {
          setTimeout(() => this.fetchAllStatuses(), 500);
        }),
        catchError((err: unknown) => {
          console.error('Failed to toggle Deluge:', err);
          this.error.set('Failed to toggle Deluge');
          return of(null);
        })
      )
      .subscribe(() => {
        this.delugeLoading.set(false);
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
          setTimeout(() => this.fetchAllStatuses(), 500);
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
