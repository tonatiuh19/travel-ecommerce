import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import {
  faTimes,
  faUserCircle,
  faCreditCard,
  faCheck,
  faLock,
  faSpinner,
  faCheckCircle,
  faHome,
  faArrowLeft,
  faVanShuttle,
  faInfoCircle,
  faExclamationTriangle,
  faMapMarkerAlt,
  faUsers,
  faCalendarAlt,
  faClock,
  faWheelchair,
  faExchangeAlt,
  faHotel,
  faPlane,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { StripeService } from '../../../landing/services/stripe.service';
import { LandingActions } from '../../../landing/store/actions';
import {
  selectReservation,
  selectIsProcessingReservation,
  selectReservationError,
} from '../../../landing/store/selectors/landing.selectors';
import { fromLanding } from '../../../landing/store/selectors';
import * as VanTransferActions from '../../store/actions/van-transfer.actions';
import {
  selectBookingResponse,
  selectIsProcessingBooking,
  selectBookingError,
} from '../../store/selectors/van-transfer.selectors';
import { LoggerService } from '../../services/logger.service';

interface BookingData {
  transferType: string;
  transferTypeName: string;
  destinationId: number | null;
  destinationName: string;
  passengerCount: number;
  isRoundTrip: boolean;
  requiresWheelchairAccess: boolean;
  pickupType: string;
  pickupName?: string;
  pickupAddress?: string;
  airportId?: number;
  airportName?: string;
  terminalId?: number;
  terminalName?: string;
  flightNumber?: string;
  serviceDate: string;
  serviceTime: string;
  returnDate?: string;
  returnTime?: string;
  basePrice: number;
  emergencyFee: number;
  serviceFee: number;
  totalPrice: number;
  isEmergencyBooking: boolean;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests?: string;
}

@Component({
  selector: 'app-van-transfer-checkout',
  templateUrl: './van-transfer-checkout.component.html',
  styleUrls: ['./van-transfer-checkout.component.css'],
})
export class VanTransferCheckoutComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('cardElement') cardElement!: ElementRef;

  // Icons
  faTimes = faTimes;
  faUserCircle = faUserCircle;
  faCreditCard = faCreditCard;
  faCheck = faCheck;
  faLock = faLock;
  faSpinner = faSpinner;
  faCheckCircle = faCheckCircle;
  faHome = faHome;
  faArrowLeft = faArrowLeft;
  faVanShuttle = faVanShuttle;
  faInfoCircle = faInfoCircle;
  faExclamationTriangle = faExclamationTriangle;
  faMapMarkerAlt = faMapMarkerAlt;
  faUsers = faUsers;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faWheelchair = faWheelchair;
  faExchangeAlt = faExchangeAlt;
  faHotel = faHotel;
  faPlane = faPlane;
  faPlus = faPlus;
  faMinus = faMinus;

  // Booking data
  bookingData: BookingData | null = null;

  // Customer information
  customerInfo: CustomerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    specialRequests: '',
  };

  // Form validation
  formErrors: { [key: string]: string } = {};
  isFormValid = false;

  // Stripe
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;
  stripeError: string | null = null;
  cardComplete = false;

  // UI states
  isProcessing = false;
  showSuccess = false;
  isMobile = false;
  acceptedTerms = false;
  showSummary = false; // Mobile summary toggle

  // Store observables and data
  public getStripeTest$ = this.store.select(fromLanding.selectIsTesting);

  // Van Transfer Booking observables
  bookingResponse$ = this.store.select(selectBookingResponse);
  isProcessingBooking$ = this.store.select(selectIsProcessingBooking);
  bookingError$ = this.store.select(selectBookingError);

  // Legacy reservation observables (keep for compatibility)
  reservation$ = this.store.select(selectReservation);
  isProcessingReservation$ = this.store.select(selectIsProcessingReservation);
  reservationError$ = this.store.select(selectReservationError);

  reservation: any = null;
  reservationError: any = null;
  bookingResponse: any = null;
  isTesting = true;

  // Unsubscribe
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private stripeService: StripeService,
    private store: Store,
    private logger: LoggerService
  ) {
    // Check if we have booking data in navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['bookingData']) {
      this.bookingData = navigation.extras.state['bookingData'];
      // Store in sessionStorage to persist on refresh
      sessionStorage.setItem(
        'vanTransferBooking',
        JSON.stringify(this.bookingData)
      );
    }
  }

  ngOnInit(): void {
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Check mobile
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());

    // Try to get booking data from sessionStorage if not in state
    if (!this.bookingData) {
      const stored = sessionStorage.getItem('vanTransferBooking');
      if (stored) {
        this.bookingData = JSON.parse(stored);
      } else {
        // No booking data, redirect to home
        this.router.navigate(['/']);
        return;
      }
    }

    // Setup store subscriptions
    this.setupStoreSubscriptions();

    // Get testing mode status
    this.getStripeTest$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isEnabled) => {
        this.isTesting = isEnabled;
      });
  }

  private setupStoreSubscriptions(): void {
    // Subscribe to van transfer booking response
    this.bookingResponse$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((response) => {
        this.logger.log('📥 Booking response received:', response);

        if (response && !this.bookingResponse) {
          this.bookingResponse = response;

          // Check if payment was successful - check both root and booking level
          const paymentStatus =
            response.payment_status || response.booking?.payment_status;
          const isPaymentSuccessful =
            response.success && paymentStatus === 'paid';

          if (isPaymentSuccessful) {
            this.logger.log('✅ Payment successful, showing success screen');
            this.showSuccess = true;
            this.isProcessing = false;

            // Clear booking data from session
            sessionStorage.removeItem('vanTransferBooking');

            // Navigate to thank-you page after 3 seconds
            this.logger.log('⏰ Setting timeout for navigation...');
            setTimeout(() => {
              this.logger.log('🚀 Navigating to thank-you page...');
              // Navigate first, don't clear the store yet
              // The thank-you component will handle clearing when it unmounts
              this.router.navigate(['/thank-you'], {
                state: {
                  bookingData: response,
                  success: true,
                },
              });
            }, 3000);
          } else {
            this.logger.log(
              '⚠️ Response received but not successful or not paid:',
              {
                success: response.success,
                payment_status: paymentStatus,
                root_payment_status: response.payment_status,
                booking_payment_status: response.booking?.payment_status,
              }
            );
          }
        }
      });

    // Subscribe to booking processing state
    this.isProcessingBooking$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((isProcessing) => {
        this.isProcessing = isProcessing || false;
      });

    // Subscribe to booking errors
    this.bookingError$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((error) => {
        this.logger.log('📥 Booking error received:', error);

        if (error && !this.reservationError) {
          this.reservationError = error;
          this.isProcessing = false;
          this.stripeError = error.message || 'Error al procesar la reserva';
          this.logger.error('❌ Van Transfer Booking error:', error);

          // Navigate to thank-you page with error after 3 seconds
          this.logger.log('⏰ Setting timeout for error navigation...');
          setTimeout(() => {
            this.logger.log('🚀 Navigating to thank-you page with error...');
            this.store.dispatch(VanTransferActions.clearVanTransferBooking());
            this.router.navigate(['/thank-you'], {
              state: {
                error: error,
                success: false,
              },
            });
          }, 3000);
        }
      });

    // Legacy subscription for old reservation system (keep for compatibility)
    this.reservation$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((reservation) => {
        if (reservation && !this.reservation) {
          this.reservation = reservation;
          this.showSuccess = true;
          this.isProcessing = false;
          this.reservationError = null;

          // Clear booking data from session
          sessionStorage.removeItem('vanTransferBooking');

          // Log success to console
          this.logger.log('✅ Booking successful:', reservation);

          // Redirect to home after 5 seconds
          setTimeout(() => {
            this.store.dispatch(LandingActions.clearReservation());
            this.router.navigate(['/']);
          }, 5000);
        }
      });

    // Subscribe to processing state
    this.isProcessingReservation$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((isProcessing) => {
        if (!this.isProcessing) {
          this.isProcessing = isProcessing || false;
        }
      });

    // Subscribe to reservation errors
    this.reservationError$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((error) => {
        if (error && !this.reservationError) {
          this.reservationError = error;
          this.isProcessing = false;
          this.stripeError = error.message || 'Error al procesar la reserva';
          console.error('❌ Booking error:', error);
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.bookingData) {
      // Initialize Stripe after view is ready
      setTimeout(() => {
        this.setupStripe();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up Stripe elements
    if (this.card) {
      this.card.destroy();
    }

    // Clear reservation state if user leaves without completing
    if (!this.showSuccess) {
      this.store.dispatch(VanTransferActions.clearVanTransferBooking());
      this.store.dispatch(LandingActions.clearReservation());
    }

    // Reset body scroll
    document.body.style.overflow = '';
  }

  private checkMobile(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // On desktop, always show summary
    if (!this.isMobile) {
      this.showSummary = true;
    } else if (!wasMobile && this.isMobile) {
      // When switching to mobile, collapse by default
      this.showSummary = false;
    }
  }

  toggleSummary(): void {
    this.showSummary = !this.showSummary;

    // Prevent body scroll when bottom sheet is open on mobile
    if (this.isMobile) {
      if (this.showSummary) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  private async setupStripe(): Promise<void> {
    try {
      // Get Stripe instance (use test mode for now)
      this.stripe = await this.stripeService.getStripe(true);

      if (!this.stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Create elements
      this.elements = this.stripe.elements();

      // Create card element with custom styling
      this.card = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#1a1a1a',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '::placeholder': {
              color: '#6c757d',
            },
          },
          invalid: {
            color: '#dc3545',
            iconColor: '#dc3545',
          },
        },
        hidePostalCode: true,
      });

      // Mount card element
      if (this.cardElement?.nativeElement) {
        this.card.mount(this.cardElement.nativeElement);

        // Listen for card changes
        this.card.on('change', (event) => {
          this.cardComplete = event.complete;
          this.stripeError = event.error ? event.error.message : null;
          this.validateForm();
        });
      }
    } catch (error) {
      console.error('Error setting up Stripe:', error);
      this.stripeError = 'Error al cargar el formulario de pago';
    }
  }

  validateForm(): void {
    this.formErrors = {};

    // Validate first name
    if (!this.customerInfo.firstName.trim()) {
      this.formErrors['firstName'] = 'El nombre es requerido';
    }

    // Validate last name
    if (!this.customerInfo.lastName.trim()) {
      this.formErrors['lastName'] = 'El apellido es requerido';
    }

    // Validate email
    if (!this.customerInfo.email.trim()) {
      this.formErrors['email'] = 'El email es requerido';
    } else if (!this.isValidEmail(this.customerInfo.email)) {
      this.formErrors['email'] = 'Email inválido';
    }

    // Validate phone
    const phoneValue = this.customerInfo.phone;
    if (!phoneValue || (typeof phoneValue === 'string' && !phoneValue.trim())) {
      this.formErrors['phone'] = 'El teléfono es requerido';
    }

    // Validate country
    if (!this.customerInfo.country.trim()) {
      this.formErrors['country'] = 'El país es requerido';
    }

    // Validate terms
    if (!this.acceptedTerms) {
      this.formErrors['terms'] = 'Debe aceptar los términos y condiciones';
    }

    // Validate card
    if (!this.cardComplete) {
      this.formErrors['card'] = 'Complete los datos de la tarjeta';
    }

    // Check if form is valid
    this.isFormValid =
      Object.keys(this.formErrors).length === 0 && this.cardComplete;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async processPayment(): Promise<void> {
    if (!this.isFormValid || !this.stripe || !this.card || !this.bookingData) {
      this.validateForm();
      return;
    }

    // Set loading state
    this.isProcessing = true;
    this.stripeError = null;
    this.reservationError = null;

    try {
      // Get phone value (handle both string and PhoneValue object)
      const phoneValue =
        typeof this.customerInfo.phone === 'string'
          ? this.customerInfo.phone
          : (this.customerInfo.phone as any).fullNumber ||
            (this.customerInfo.phone as any).phoneNumber ||
            this.customerInfo.phone;

      // Create payment method
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: `${this.customerInfo.firstName} ${this.customerInfo.lastName}`,
          email: this.customerInfo.email,
          phone: phoneValue,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Prepare booking request
      const bookingRequest = {
        // Customer info
        firstName: this.customerInfo.firstName,
        lastName: this.customerInfo.lastName,
        email: this.customerInfo.email,
        phone: phoneValue,
        country: this.customerInfo.country,

        // Booking info
        transferType: this.bookingData.transferType,
        destinationId: this.bookingData.destinationId,
        passengerCount: this.bookingData.passengerCount,
        isRoundTrip: this.bookingData.isRoundTrip,
        requiresWheelchairAccess: this.bookingData.requiresWheelchairAccess,

        // Pickup info
        pickupType: this.bookingData.pickupType,
        pickupName: this.bookingData.pickupName,
        pickupAddress: this.bookingData.pickupAddress,
        pickupAirportId: this.bookingData.airportId,
        pickupTerminalId: this.bookingData.terminalId,
        pickupFlightNumber: this.bookingData.flightNumber,

        // Service date/time
        serviceDate: this.bookingData.serviceDate,
        serviceTime: this.bookingData.serviceTime,
        returnDate: this.bookingData.returnDate,
        returnTime: this.bookingData.returnTime,

        // Pricing
        basePrice: this.bookingData.basePrice,
        emergencyFee: this.bookingData.emergencyFee,
        serviceFee: this.bookingData.serviceFee,
        totalPrice: this.bookingData.totalPrice,

        // Other
        specialRequests: this.customerInfo.specialRequests,
        stripePaymentMethodId: paymentMethod.id,
        paymentType: 'card',
      };

      // Dispatch action to process booking
      this.store.dispatch(
        VanTransferActions.processVanTransferBooking({ bookingRequest })
      );

      // Log booking details for debugging
      this.logger.log('📦 Processing Van Transfer Booking:', {
        bookingData: this.bookingData,
        customer: `${this.customerInfo.firstName} ${this.customerInfo.lastName}`,
        email: this.customerInfo.email,
        paymentMethodId: paymentMethod.id,
      });
    } catch (error: any) {
      this.logger.error('❌ Payment error:', error);
      this.stripeError = error.message || 'Error al procesar el pago';
      this.isProcessing = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getPickupTypeLabel(): string {
    if (!this.bookingData) return '';

    switch (this.bookingData.pickupType) {
      case 'hotel':
        return 'Hotel';
      case 'airport':
        return 'Aeropuerto';
      case 'airbnb':
        return 'Airbnb';
      default:
        return '';
    }
  }

  getPickupDetails(): string {
    if (!this.bookingData) return '';

    if (this.bookingData.pickupType === 'airport') {
      return `${this.bookingData.airportName} - ${this.bookingData.terminalName}`;
    } else {
      return this.bookingData.pickupName || '';
    }
  }

  fillTestData(): void {
    if (!this.isTesting) {
      return;
    }

    // Fill customer info with test data
    this.customerInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'axgoomez@gmail.com',
      phone: '+33 6 12 34 56 78',
      country: 'Francia',
      specialRequests: 'This is a test booking',
    };

    // Accept terms
    this.acceptedTerms = true;

    // Validate form
    this.validateForm();

    // Focus on card element
    if (this.card) {
      this.card.focus();
    }

    this.logger.log('✅ Test data filled successfully');
  }
}
