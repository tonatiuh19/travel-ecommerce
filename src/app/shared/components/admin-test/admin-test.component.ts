import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import {
  faLock,
  faUnlock,
  faToggleOn,
  faToggleOff,
  faEye,
  faEyeSlash,
  faSignOutAlt,
  faDesktop,
  faMobile,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { LandingActions } from '../../../landing/store/actions';

@Component({
  selector: 'app-admin-test',
  templateUrl: './admin-test.component.html',
  styleUrls: ['./admin-test.component.css'],
})
export class AdminTestComponent implements OnInit, OnDestroy {
  // FontAwesome Icons
  faLock = faLock;
  faUnlock = faUnlock;
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faSignOutAlt = faSignOutAlt;
  faDesktop = faDesktop;
  faMobile = faMobile;
  faCheck = faCheck;
  faTimes = faTimes;

  // Form data
  password: string = '';
  showPassword: boolean = false;

  // State
  isAuthenticated: boolean = false;
  isTestingModeEnabled: boolean = false;
  isAuthenticating: boolean = false;
  authError: boolean = false;

  // Store subscriptions
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Add a small delay to ensure store is properly initialized
    setTimeout(() => {
      // Subscribe to authentication status
      /*       this.store
        .select(selectIsAdminAuthenticated)
        .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
        .subscribe({
          next: (isAuthenticated) => {
            this.isAuthenticated = isAuthenticated || false;
            this.isAuthenticating = false;

            if (isAuthenticated) {
              this.authError = false;
              this.password = '';
            } else if (this.password) {
              // Only show error if we tried to authenticate
              this.authError = true;
            }
          },
          error: (error) => {
            console.error('Error subscribing to admin authentication:', error);
            this.isAuthenticated = false;
            this.isAuthenticating = false;
          },
        });
 */
      // Subscribe to testing mode status
      /* this.store
        .select(selectIsTestingModeEnabled)
        .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
        .subscribe({
          next: (isEnabled) => {
            this.isTestingModeEnabled = isEnabled || false;
          },
          error: (error) => {
            console.error('Error subscribing to testing mode:', error);
            this.isTestingModeEnabled = false;
          },
        }); */
    }, 100);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  authenticate(): void {
    if (!this.password.trim()) {
      this.authError = true;
      return;
    }

    this.isAuthenticating = true;
    this.authError = false;

    this.store.dispatch(
      LandingActions.authenticateAdmin({ password: this.password })
    );
  }

  toggleTestingMode(): void {
    if (this.isAuthenticated) {
      this.store.dispatch(
        LandingActions.toggleTestingMode({
          isEnabled: !this.isTestingModeEnabled,
        })
      );
    }
  }

  logout(): void {
    this.store.dispatch(LandingActions.logoutAdmin());
    this.password = '';
    this.authError = false;
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isAuthenticated) {
      this.authenticate();
    }
  }
}
