import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsTesting } from '../../landing/store/selectors/landing.selectors';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private isTestingMode = false;

  constructor(private store: Store) {
    // Subscribe to testing mode changes
    this.store.select(selectIsTesting).subscribe((isTesting) => {
      this.isTestingMode = isTesting;
    });
  }

  /**
   * Log a message only if testing mode is enabled
   */
  log(...args: any[]): void {
    if (this.isTestingMode) {
      console.log(...args);
    }
  }

  /**
   * Log an info message only if testing mode is enabled
   */
  info(...args: any[]): void {
    if (this.isTestingMode) {
      console.info(...args);
    }
  }

  /**
   * Log a warning only if testing mode is enabled
   */
  warn(...args: any[]): void {
    if (this.isTestingMode) {
      console.warn(...args);
    }
  }

  /**
   * Log an error (always logged regardless of testing mode for critical errors)
   */
  error(...args: any[]): void {
    console.error(...args);
  }

  /**
   * Log a debug message only if testing mode is enabled
   */
  debug(...args: any[]): void {
    if (this.isTestingMode) {
      console.debug(...args);
    }
  }

  /**
   * Log a table only if testing mode is enabled
   */
  table(data: any): void {
    if (this.isTestingMode) {
      console.table(data);
    }
  }

  /**
   * Start a timer only if testing mode is enabled
   */
  time(label: string): void {
    if (this.isTestingMode) {
      console.time(label);
    }
  }

  /**
   * End a timer only if testing mode is enabled
   */
  timeEnd(label: string): void {
    if (this.isTestingMode) {
      console.timeEnd(label);
    }
  }

  /**
   * Check if testing mode is currently enabled
   */
  isTestMode(): boolean {
    return this.isTestingMode;
  }
}
