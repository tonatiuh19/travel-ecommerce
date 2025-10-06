import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LandingState, VisitorSection } from '../landing/landing.model';
import { getReservationByCode } from '../landing/store/actions/landing.actions';
import { LandingActions } from '../landing/store/actions';
import {
  selectReservation,
  selectReservationLoading,
  selectReservationError,
} from '../landing/store/selectors/landing.selectors';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent implements OnInit, OnDestroy {
  reservation$: Observable<any>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private destroy$ = new Subject<void>();
  reservationCode: string = '';
  showSearchForm: boolean = true;

  constructor(
    private store: Store<{ landing: LandingState }>,
    private route: ActivatedRoute
  ) {
    this.reservation$ = this.store.select(selectReservation);
    this.loading$ = this.store.select(selectReservationLoading);
    this.error$ = this.store.select(selectReservationError);
  }

  ngOnInit(): void {
    // Track reservation page visit
    this.trackReservationVisit();

    // Check if reservation code is provided via query params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['code']) {
          this.reservationCode = params['code'];
          this.searchReservation();
        }
      });

    // Listen for reservation data
    this.reservation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservation) => {
        if (reservation) {
          this.showSearchForm = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchReservation(): void {
    if (this.reservationCode.trim()) {
      this.store.dispatch(
        getReservationByCode({ reservationCode: this.reservationCode.trim() })
      );
    }
  }

  newSearch(): void {
    this.showSearchForm = true;
    this.reservationCode = '';
  }

  getServiceTypeDisplay(serviceType: string): string {
    const serviceTypes: { [key: string]: string } = {
      package: 'Paquete Turístico',
      van_transfer: 'Traslado en Van',
      tour: 'Tour',
      paris_tour: 'Tour Express París',
      city_tour: 'Tour de Ciudad',
      airport_tour: 'Tour desde Aeropuerto',
      hotel: 'Hotel',
    };
    return serviceTypes[serviceType] || serviceType;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount: number): string {
    if (!amount) return '';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  private trackReservationVisit(): void {
    this.store.dispatch(
      LandingActions.trackVisitor({ section: VisitorSection.RESERVATION })
    );
  }
}
