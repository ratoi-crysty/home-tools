import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppStatus } from '../../models/app.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss',
})
export class AppCardComponent {
  readonly status = input.required<AppStatus | null>();
  readonly loading = input<boolean>(false);
  readonly appName = input.required<string>();
  readonly appIcon = input<string>('smart_display');

  readonly toggleStatus = output<void>();

  readonly isRunning = computed((): boolean => this.status()?.running ?? false);
  readonly statusText = computed((): string => {
    if (this.loading()) return 'PROCESSING';
    return this.isRunning() ? 'ONLINE' : 'OFFLINE';
  });
  readonly pid = computed((): number | null => this.status()?.pid ?? null);

  onToggle(): void {
    this.toggleStatus.emit();
  }
}
