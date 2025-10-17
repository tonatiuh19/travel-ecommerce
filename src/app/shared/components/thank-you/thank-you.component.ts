import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  faCheckCircle,
  faTimesCircle,
  faDownload,
  faHome,
  faReceipt,
  faVanShuttle,
  faArrowRight,
  faPlaneDeparture,
  faPlaneArrival,
  faUsers,
  faUserCheck,
  faCreditCard,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faPlane,
  faHotel,
  faInfoCircle,
  faExclamationTriangle,
  faLock,
  faShieldAlt,
  faRefresh,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {
  selectBookingResponse,
  selectBookingError,
} from '../../store/selectors/van-transfer.selectors';
import * as VanTransferActions from '../../store/actions/van-transfer.actions';
import { LoggerService } from '../../services/logger.service';

export interface BookingDetails {
  // Basic booking info
  origin?: string;
  destination?: string;
  departureDate?: string;
  departureTime?: string;
  returnDate?: string;
  returnTime?: string;
  passengers?: number;
  isRoundTrip?: boolean;

  // Pricing
  totalPrice?: number;
  serviceFee?: number;
  urgencyFee?: number;
  grandTotal?: number;
  savings?: number;

  // Express trip details
  expressTrip?: {
    type: string;
    pickupLocation?: string;
    isRoundTrip?: boolean;
    returnPickupTime?: string;
  };

  // Pickup information
  pickupInfo?: {
    type: string;
    flightNumber?: string;
    airline?: string;
    flightArrivalTime?: string;
    terminal?: string;
    hotelName?: string;
    address?: string;
  };

  // Vehicle info
  vans?: Array<{
    van: {
      name: string;
      capacity: number;
      features?: string[];
    };
    quantity: number;
  }>;

  // Route info
  distance?: string;
  duration?: string;
}

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  specialRequests?: string;
}

export interface PaymentMethod {
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css'],
})
export class ThankYouComponent implements OnInit, OnDestroy {
  // Component state (no more @Input/@Output)
  isVisible: boolean = true;
  paymentSuccessful: boolean = false;
  bookingDetails: BookingDetails | null = null;
  userInfo: UserInfo = {};
  paymentMethod: PaymentMethod = {};
  reservationData: any = null;

  // Store data
  bookingResponse: any = null;
  bookingError: any = null;

  // Unsubscribe subject
  private destroy$ = new Subject<void>();

  // FontAwesome icons
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faDownload = faDownload;
  faHome = faHome;
  faReceipt = faReceipt;
  faVanShuttle = faVanShuttle;
  faArrowRight = faArrowRight;
  faPlaneDeparture = faPlaneDeparture;
  faPlaneArrival = faPlaneArrival;
  faUsers = faUsers;
  faUserCheck = faUserCheck;
  faCreditCard = faCreditCard;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faMapMarkerAlt = faMapMarkerAlt;
  faPlane = faPlane;
  faHotel = faHotel;
  faInfoCircle = faInfoCircle;
  faExclamationTriangle = faExclamationTriangle;
  faLock = faLock;
  faShieldAlt = faShieldAlt;
  faRefresh = faRefresh;
  faArrowLeft = faArrowLeft;

  confirmationNumber: string = '';

  constructor(
    private router: Router,
    private store: Store,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger.log('🎉 Thank You page loaded');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Subscribe to booking response from store
    this.store
      .select(selectBookingResponse)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response) {
          this.logger.log('✅ Booking response from store:', response);
          this.logger.log(
            '📊 Response structure:',
            JSON.stringify(response, null, 2)
          );
          this.bookingResponse = response;

          // Check for success at both root level and booking level
          const isSuccessful = response.success === true;
          const paymentStatus =
            response.payment_status || response.booking?.payment_status;

          this.logger.log('🔍 Debug payment status check:');
          this.logger.log('  - response.success:', response.success);
          this.logger.log('  - isSuccessful:', isSuccessful);
          this.logger.log(
            '  - response.payment_status:',
            response.payment_status
          );
          this.logger.log(
            '  - response.booking?.payment_status:',
            response.booking?.payment_status
          );
          this.logger.log('  - paymentStatus:', paymentStatus);
          this.logger.log(
            '  - paymentStatus === "paid":',
            paymentStatus === 'paid'
          );

          this.paymentSuccessful = isSuccessful && paymentStatus === 'paid';
          this.logger.log(
            '  - Final paymentSuccessful:',
            this.paymentSuccessful
          );

          this.reservationData = response;

          // Map van transfer booking data to BookingDetails format
          if (response.booking) {
            this.bookingDetails = {
              origin: 'Paris',
              destination:
                response.booking.destination_name ||
                response.booking.transfer_type_name,
              departureDate: response.booking.service_date,
              departureTime: response.booking.service_time,
              returnDate: response.booking.return_date,
              returnTime: response.booking.return_time,
              passengers: response.booking.passenger_count,
              isRoundTrip: response.booking.is_round_trip,
              totalPrice: response.booking.total_price,
            };

            this.userInfo = {
              firstName: response.booking.first_name,
              lastName: response.booking.last_name,
              email: response.booking.email,
              phone: response.booking.phone,
              specialRequests: response.booking.special_requests,
            };
          }

          this.confirmationNumber = this.generateConfirmationNumber();
          this.logger.log('📋 Confirmation number:', this.confirmationNumber);
        } else {
          this.logger.warn('⚠️ No booking response found in store');
        }
      });

    // Subscribe to booking errors from store
    this.store
      .select(selectBookingError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.logger.error('❌ Booking error from store:', error);
          this.bookingError = error;
          this.paymentSuccessful = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clear booking state when leaving the page
    this.store.dispatch(VanTransferActions.clearVanTransferBooking());
  }

  generateConfirmationNumber(): string {
    // Try different possible paths for the booking reference
    if (this.reservationData?.booking_reference) {
      return this.reservationData.booking_reference;
    }
    if (this.reservationData?.booking?.booking_reference) {
      return this.reservationData.booking.booking_reference;
    }
    if (this.reservationData?.reservation?.reservation_code) {
      return this.reservationData.reservation.reservation_code;
    }
    return 'PENDING';
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  close() {
    this.logger.log('👋 Closing thank you page');
    this.goHome();
  }

  onDownloadConfirmation() {
    this.logger.log('📄 Download confirmation requested');
    // TODO: Implement PDF download functionality
    alert('La funcionalidad de descarga estará disponible próximamente');
  }

  onTryAgain() {
    this.logger.log('🔄 Retry payment requested');
    this.goHome();
  }

  goHome() {
    this.logger.log('🏠 Navigating to home');
    this.router.navigate(['/']);
  }
}
