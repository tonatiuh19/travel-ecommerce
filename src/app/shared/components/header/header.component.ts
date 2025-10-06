import {
  Component,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { selectIsTesting } from '../../../landing/store/selectors/landing.selectors';
import { fromLanding } from '../../../landing/store/selectors';
import { LandingActions } from '../../../landing/store/actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isMain = true;
  public isColorDark = true;
  public isLogoSmall = false;
  public getStripeTest$ = this.store.select(fromLanding.selectIsTesting);
  public isTestingModeEnabled = false;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(LandingActions.getStripeTest());

    this.getStripeTest$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isEnabled) => {
        if (isEnabled) {
          console.log('Testing mode status:', isEnabled);
          this.isTestingModeEnabled = isEnabled;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.getElementById('navbar');

    const targetElement = document.getElementById('van-transfers');

    if (this.isMain) {
      if (navbar && targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top;
        const navbarHeight = navbar.offsetHeight;

        if (targetPosition <= navbarHeight) {
          this.isColorDark = false;
          this.isLogoSmall = true;
          navbar.classList.add('bg-primary');
        } else {
          this.isColorDark = true;
          this.isLogoSmall = false;
          navbar.classList.remove('bg-primary');
        }
      }
    } else {
      navbar ? navbar.classList.add('bg-primary') : null;
    }
  }

  navigateToReservation() {
    this.router.navigate(['/reserva']);
  }
}
