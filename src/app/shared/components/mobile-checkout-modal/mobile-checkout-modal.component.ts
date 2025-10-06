import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  faArrowLeft,
  faUserCircle,
  faCreditCard,
  faCheckCircle,
  faDownload,
  faHome,
  faReceipt,
  faArrowRight,
  faPlaneDeparture,
  faPlaneArrival,
  faUsers,
  faUserCheck,
  faLock,
  faSpinner,
  faTimes,
  faVanShuttle,
  faShieldAlt,
  faStepForward,
  faStepBackward,
  faPlane,
  faHotel,
  faInfoCircle,
  faClock,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { StripeService } from '../../../landing/services/stripe.service';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { LandingActions } from '../../../landing/store/actions';
import {
  selectReservation,
  selectIsProcessingReservation,
  selectReservationError,
} from '../../../landing/store/selectors/landing.selectors';
import { PhoneValue } from '../phone-input-picker/phone-input-picker.component';
import { fromLanding } from '../../../landing/store/selectors';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  passportNumber?: string;
  specialRequests?: string;
}

interface BookingDetails {
  bookingId: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number;
  vans: any[];
  totalPrice: number;
  serviceFee?: number;
  urgencyFee?: number;
  returnTotalPrice?: number;
  grandTotal?: number;
  savings?: number;
  isRoundTrip: boolean;
  duration: string;
  distance: string;
  pickupInfo?: {
    type: string;
    airport?: string;
    flightNumber?: string;
    airline?: string;
    flightArrivalTime?: string;
    terminal?: string;
    hotelName?: string;
    address?: string;
  };
  expressTrip?: {
    type: string;
    pickupLocation?: string;
    returnPickupTime?: string;
    isRoundTrip?: boolean;
  };
  airportInfo?: {
    airport?: string;
    airportLabel?: string;
    flightNumber?: string;
    airline?: string;
    terminal?: string;
    arrivalTime?: string;
  };
}

interface PaymentMethod {
  cardholderName: string;
  // Stripe Elements will handle the card details securely
}

@Component({
  selector: 'app-mobile-checkout-modal',
  templateUrl: './mobile-checkout-modal.component.html',
  styleUrl: './mobile-checkout-modal.component.css',
})
export class MobileCheckoutModalComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() isVisible: boolean = false;
  @Input() bookingDetails: BookingDetails | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() bookingConfirmed = new EventEmitter<any>();

  public getStripeTest$ = this.store.select(fromLanding.selectIsTesting);

  // FontAwesome Icons
  faArrowLeft = faArrowLeft;
  faUserCircle = faUserCircle;
  faCreditCard = faCreditCard;
  faCheckCircle = faCheckCircle;
  faDownload = faDownload;
  faHome = faHome;
  faReceipt = faReceipt;
  faArrowRight = faArrowRight;
  faPlaneDeparture = faPlaneDeparture;
  faPlaneArrival = faPlaneArrival;
  faUsers = faUsers;
  faUserCheck = faUserCheck;
  faLock = faLock;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faVanShuttle = faVanShuttle;
  faShieldAlt = faShieldAlt;
  faStepForward = faStepForward;
  faStepBackward = faStepBackward;
  faPlane = faPlane;
  faHotel = faHotel;
  faInfoCircle = faInfoCircle;
  faClock = faClock;
  faExclamationTriangle = faExclamationTriangle;

  // Multi-step navigation
  currentStep: number = 1;
  totalSteps: number = 2;

  paymentMethod: PaymentMethod = {
    cardholderName: '',
  };

  // State management
  isProcessingPayment: boolean = false;
  showConfirmation: boolean = false;
  acceptedTerms: boolean = false;
  private confirmationProcessing: boolean = false; // Flag to prevent state clearing during confirmation flow
  private stripeSetupInitialized: boolean = false; // Flag to prevent Stripe setup loop

  // Error handling
  stripeError: string | null = null;
  generalError: string | null = null;

  // Stripe integration
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;
  private isTesting = true;

  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    passportNumber: '',
    specialRequests: '',
  };

  // Store observables
  reservation$ = this.store.select(selectReservation);
  isProcessingReservation$ = this.store.select(selectIsProcessingReservation);
  reservationError$ = this.store.select(selectReservationError);

  // Store data
  reservation: any = null;
  reservationError: any = null;

  // Unsubscription
  private unsubscribe$ = new Subject<void>();
  private dateFormatCache = new Map<string, string>();

  countries: string[] = [
    'Alemania',
    'Argentina',
    'Australia',
    'Bélgica',
    'Bolivia',
    'Brasil',
    'Canadá',
    'Chile',
    'China',
    'Colombia',
    'Costa Rica',
    'Ecuador',
    'El Salvador',
    'España',
    'Estados Unidos',
    'Francia',
    'Guatemala',
    'Holanda',
    'Honduras',
    'Italia',
    'Japón',
    'México',
    'Nicaragua',
    'Panamá',
    'Paraguay',
    'Perú',
    'Portugal',
    'Puerto Rico',
    'Reino Unido',
    'República Dominicana',
    'Uruguay',
    'Venezuela',
  ];

  constructor(private stripeService: StripeService, private store: Store) {}

  ngOnInit(): void {
    this.getStripeTest$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isEnabled) => {
        if (isEnabled) {
          console.log('Testing checkout mode status:', isEnabled);
          this.isTesting = isEnabled;
        } else {
          this.isTesting = isEnabled;
        }

        this.userInfo = this.isTesting
          ? {
              firstName: 'Juan Carlos',
              lastName: 'García López',
              email: 'axgoomez@gmail.com',
              phone: '+34 612 345 678',
              nationality: 'España',
              dateOfBirth: '1985-03-15',
              passportNumber: 'P12345678',
              specialRequests: 'Asiento con vista, si es posible',
            }
          : {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              nationality: '',
              dateOfBirth: '',
              passportNumber: '',
              specialRequests: '',
            };
      });
    // Set up viewport to prevent zoom when modal is visible
    if (this.isVisible) {
      this.disableZoom();
    }
    this.preventHorizontalScroll();

    // Clear any existing store state BEFORE setting up subscriptions
    this.clearStoreState();

    // Add a small delay to ensure the store is cleared before subscribing
    setTimeout(() => {
      this.setupStoreSubscriptions();
    }, 100);
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.disableZoom();
      // Reset confirmation state when modal becomes visible for a new checkout
      if (!this.confirmationProcessing) {
        this.showConfirmation = false;
      }
      // Clear any previous error messages
      this.clearErrors();
    } else {
      this.enableZoom();
    }

    // Setup Stripe only when modal becomes visible for the first time and hasn't been initialized yet
    if (
      this.isVisible &&
      !this.showConfirmation &&
      !this.confirmationProcessing &&
      !this.stripeSetupInitialized
    ) {
      this.stripeSetupInitialized = true; // Set flag to prevent multiple setups
      setTimeout(() => {
        this.waitForElementAndSetupStripe();
      }, 200);
    }

    // Reset initialization flag when modal is closed
    if (!this.isVisible) {
      this.confirmationProcessing = false;
      this.stripeSetupInitialized = false;
    }
  }

  ngAfterViewInit(): void {
    // Setup Stripe when view is initialized and modal is visible, but only if not already initialized
    if (
      this.isVisible &&
      !this.showConfirmation &&
      !this.stripeSetupInitialized
    ) {
      this.stripeSetupInitialized = true;
      this.waitForElementAndSetupStripe();
    }
  }

  private disableZoom(): void {
    // Get or create viewport meta tag
    let viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    // Store original content to restore later
    if (!viewport.getAttribute('data-original-content')) {
      viewport.setAttribute('data-original-content', viewport.content || '');
    }

    // Set content to disable zoom
    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

    // Prevent double-tap zoom with touch-action
    document.body.style.touchAction = 'manipulation';
  }

  private enableZoom(): void {
    // Restore original viewport content
    const viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (viewport) {
      const originalContent = viewport.getAttribute('data-original-content');
      if (originalContent) {
        viewport.content = originalContent;
      } else {
        viewport.content = 'width=device-width, initial-scale=1.0';
      }
    }

    // Restore body touch-action
    document.body.style.touchAction = 'auto';
  }

  private preventHorizontalScroll(): void {
    // Apply overflow-x: hidden to prevent horizontal scrolling
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.body.style.maxWidth = '100%';

      // Force all elements to respect viewport width
      const style = document.createElement('style');
      style.id = 'mobile-modal-overflow-prevention';
      style.textContent = `
        .mobile-checkout-overlay,
        .mobile-checkout-container {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }
        
        .mobile-content,
        .mobile-form,
        .step-content {
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .form-control,
        .form-select,
        .btn {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .container, .row {
          overflow-x: hidden !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      `;

      // Remove existing style if it exists
      const existingStyle = document.getElementById(
        'mobile-modal-overflow-prevention'
      );
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);
    }
  }

  // Navigation methods
  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
      // If moving to step 2 (payment), ensure Stripe is set up
      if (this.currentStep === 2) {
        setTimeout(() => {
          this.waitForElementAndSetupStripe();
        }, 100);
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      // Clean up Stripe elements when leaving step 2
      if (this.currentStep === 2) {
        this.cleanupStripe();
        this.stripeSetupInitialized = false;
      }
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      const previousStep = this.currentStep;

      // Clean up Stripe elements when leaving step 2
      if (previousStep === 2 && step !== 2) {
        this.cleanupStripe();
        this.stripeSetupInitialized = false;
      }

      this.currentStep = step;

      // If moving to step 2 (payment), ensure Stripe is set up
      if (step === 2) {
        setTimeout(() => {
          this.waitForElementAndSetupStripe();
        }, 100);
      }
    }
  }

  // Phone input handler
  onPhoneChange(phoneValue: any): void {
    if (phoneValue && typeof phoneValue === 'object' && phoneValue.fullNumber) {
      this.userInfo.phone = phoneValue.fullNumber;
    } else if (typeof phoneValue === 'string') {
      this.userInfo.phone = phoneValue;
    }
  }

  // Validation methods
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1: // Personal info
        return (
          this.userInfo.firstName.trim() !== '' &&
          this.userInfo.lastName.trim() !== '' &&
          this.userInfo.email.trim() !== '' &&
          this.userInfo.phone.trim() !== '' &&
          this.userInfo.nationality.trim() !== ''
        );
      case 2: // Payment info with summary
        return (
          this.paymentMethod.cardholderName.trim() !== '' && this.acceptedTerms
        );
      default:
        return false;
    }
  }

  validateAllInfo(): boolean {
    return (
      this.userInfo.firstName.trim() !== '' &&
      this.userInfo.lastName.trim() !== '' &&
      this.userInfo.email.trim() !== '' &&
      this.userInfo.phone.trim() !== '' &&
      this.userInfo.nationality.trim() !== '' &&
      this.paymentMethod.cardholderName.trim() !== ''
    );
  }

  // Payment processing
  async processPayment(): Promise<void> {
    if (!this.stripe || !this.card) {
      this.stripeError =
        'Error del sistema de pagos. Por favor, recarga la página e intenta de nuevo.';
      return;
    }

    if (!this.validateAllInfo()) {
      this.stripeError = 'Por favor, complete toda la información requerida.';
      return;
    }

    // Clear any previous errors
    this.clearErrors();
    this.isProcessingPayment = true;

    try {
      // Create Stripe token
      const { token, error } = await this.stripe.createToken(this.card);

      if (error) {
        console.error('Mobile Stripe token error:', error);
        this.isProcessingPayment = false;
        this.stripeError = this.translateStripeError(
          error.message || 'Error procesando el pago'
        );
        return;
      }

      // Prepare user info for API
      const userInfo = {
        name: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
        email: this.userInfo.email,
        phone: this.userInfo.phone,
        country: this.userInfo.nationality,
        birth_date: this.userInfo.dateOfBirth || undefined,
        passport_no: this.userInfo.passportNumber || undefined,
      };

      // Prepare reservation info for API
      const reservationInfo = {
        service_type: this.getServiceType(),
        origin: this.bookingDetails?.origin || '',
        destination: this.bookingDetails?.destination || '',
        pickup_datetime: this.getPickupDateTime(),
        return_datetime: this.getReturnDateTime(),
        passengers: this.bookingDetails?.passengers || 1,
        price:
          this.bookingDetails?.grandTotal ||
          this.bookingDetails?.totalPrice ||
          0,
        price_eur: String(
          this.bookingDetails?.grandTotal ||
            this.bookingDetails?.totalPrice ||
            0
        ),
        urgency_trip: this.bookingDetails?.urgencyFee ? 1 : 0,
        special_note: this.buildSpecialNote(),
        pickup_type: this.bookingDetails?.pickupInfo?.type || undefined,
        pickup_airport:
          this.bookingDetails?.pickupInfo?.airport ||
          this.bookingDetails?.airportInfo?.airport ||
          undefined,
        pickup_flight_number:
          this.bookingDetails?.pickupInfo?.flightNumber ||
          this.bookingDetails?.airportInfo?.flightNumber ||
          undefined,
        pickup_airline:
          this.bookingDetails?.pickupInfo?.airline ||
          this.bookingDetails?.airportInfo?.airline ||
          undefined,
        pickup_terminal:
          this.bookingDetails?.pickupInfo?.terminal ||
          this.bookingDetails?.airportInfo?.terminal ||
          undefined,
        pickup_hotel_name:
          this.bookingDetails?.pickupInfo?.type === 'hotel'
            ? this.bookingDetails?.pickupInfo?.hotelName
            : this.bookingDetails?.expressTrip?.type === 'airport-hotel-airport'
            ? this.bookingDetails?.pickupInfo?.hotelName
            : undefined,
        pickup_address: this.bookingDetails?.pickupInfo?.address || undefined,
        wheelchair_access: 0, // Add if needed
        status: 'confirmed',
      };

      // Dispatch create reservation action
      this.store.dispatch(
        LandingActions.createReservation({
          userInfo,
          reservationInfo,
          stripeToken: token.id,
          payment_type: 'stripe',
        })
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      this.isProcessingPayment = false;
      this.stripeError =
        'Error inesperado procesando el pago. Por favor, intenta de nuevo.';
    }
  }

  private getServiceType(): string {
    // Determine service type based on booking details
    if (this.bookingDetails?.expressTrip?.type) {
      switch (this.bookingDetails.expressTrip.type) {
        case 'paris-tour-4h':
          return 'paris_tour';
        case 'disney-transfer':
          return 'disney_transfer';
        case 'airport-hotel-airport':
          return 'airport_hotel_airport';
        default:
          return 'van_transfer';
      }
    }

    // Default to regular van transfer
    return 'van_transfer';
  }

  private getPickupDateTime(): string {
    if (!this.bookingDetails?.departureDate) {
      return '';
    }

    // For Paris tour and airport-hotel-airport services, use flight arrival time
    if (
      this.bookingDetails?.expressTrip?.type === 'paris-tour-4h' ||
      this.bookingDetails?.expressTrip?.type === 'airport-hotel-airport'
    ) {
      const arrivalTime =
        this.bookingDetails?.pickupInfo?.flightArrivalTime ||
        this.bookingDetails?.airportInfo?.arrivalTime;
      if (arrivalTime) {
        return `${this.bookingDetails.departureDate} ${arrivalTime}`;
      }
    }

    // For Disney transfer, check pickup location type
    if (this.bookingDetails?.expressTrip?.type === 'disney-transfer') {
      if (this.bookingDetails?.expressTrip?.pickupLocation === 'airport') {
        // Disney transfer from airport - use flight arrival time
        const arrivalTime =
          this.bookingDetails?.pickupInfo?.flightArrivalTime ||
          this.bookingDetails?.airportInfo?.arrivalTime;
        if (arrivalTime) {
          return `${this.bookingDetails.departureDate} ${arrivalTime}`;
        }
      } else {
        // Disney transfer from hotel - use departure time
        const time = this.bookingDetails?.departureTime;
        if (time) {
          return `${this.bookingDetails.departureDate} ${time}`;
        }
      }
    }

    // For regular transfers, use departure time
    const time = this.bookingDetails?.departureTime;
    if (time) {
      return `${this.bookingDetails.departureDate} ${time}`;
    }

    return `${this.bookingDetails.departureDate} 10:00`; // Default fallback
  }

  private getReturnDateTime(): string | undefined {
    // For airport-hotel-airport service with round trip
    if (
      this.bookingDetails?.expressTrip?.type === 'airport-hotel-airport' &&
      this.bookingDetails?.expressTrip?.isRoundTrip
    ) {
      if (
        this.bookingDetails?.returnDate &&
        this.bookingDetails?.expressTrip?.returnPickupTime
      ) {
        return `${this.bookingDetails.returnDate} ${this.bookingDetails.expressTrip.returnPickupTime}`;
      }
    }

    // For regular transfers with return (not Amsterdam)
    if (
      this.bookingDetails?.returnDate &&
      this.bookingDetails?.returnTime &&
      this.bookingDetails?.destination !== 'Ámsterdam'
    ) {
      return `${this.bookingDetails.returnDate} ${this.bookingDetails.returnTime}`;
    }

    // Paris tour and Disney transfer don't have return trips
    if (
      this.bookingDetails?.expressTrip?.type === 'paris-tour-4h' ||
      this.bookingDetails?.expressTrip?.type === 'disney-transfer'
    ) {
      return undefined;
    }

    // Amsterdam transfers are one-way only
    if (this.bookingDetails?.destination === 'Ámsterdam') {
      return undefined;
    }

    return undefined;
  }

  private buildSpecialNote(): string | undefined {
    let specialNotes: string[] = [];

    // Add user's special requests if any
    if (this.userInfo.specialRequests?.trim()) {
      specialNotes.push(
        `SOLICITUDES ESPECIALES: ${this.userInfo.specialRequests.trim()}`
      );
    }

    // Add service-specific notes
    if (this.bookingDetails?.expressTrip?.type) {
      switch (this.bookingDetails.expressTrip.type) {
        case 'paris-tour-4h':
          specialNotes.push(
            'TOUR EXPRESS PARÍS (4 horas) - Mínimo 5h de escala requerida'
          );
          const flightNumber =
            this.bookingDetails.pickupInfo?.flightNumber ||
            this.bookingDetails.airportInfo?.flightNumber;
          const airline =
            this.bookingDetails.pickupInfo?.airline ||
            this.bookingDetails.airportInfo?.airline;
          if (flightNumber) {
            specialNotes.push(`VUELO: ${flightNumber} - ${airline}`);
          }
          break;

        case 'airport-hotel-airport':
          if (this.bookingDetails.expressTrip.isRoundTrip) {
            const returnDate =
              this.bookingDetails?.returnDate || 'No especificada';
            const returnTime =
              this.bookingDetails?.expressTrip?.returnPickupTime ||
              'No especificada';
            const hotelName =
              this.bookingDetails?.pickupInfo?.hotelName ||
              'Hotel no especificado';
            specialNotes.push(
              `REGRESO: Recogida en ${hotelName} el ${returnDate} a las ${returnTime} para traslado al aeropuerto`
            );
          } else {
            specialNotes.push('SERVICIO SOLO IDA - Aeropuerto → Hotel');
          }
          const flightNumberAHA =
            this.bookingDetails.pickupInfo?.flightNumber ||
            this.bookingDetails.airportInfo?.flightNumber;
          const airlineAHA =
            this.bookingDetails.pickupInfo?.airline ||
            this.bookingDetails.airportInfo?.airline;
          if (flightNumberAHA) {
            specialNotes.push(
              `VUELO LLEGADA: ${flightNumberAHA} - ${airlineAHA}`
            );
          }
          break;

        case 'disney-transfer':
          if (this.bookingDetails.expressTrip.pickupLocation === 'airport') {
            specialNotes.push('TRANSPORTE DISNEY - Recogida en aeropuerto');
            const flightNumberDisney =
              this.bookingDetails.pickupInfo?.flightNumber ||
              this.bookingDetails.airportInfo?.flightNumber;
            const airlineDisney =
              this.bookingDetails.pickupInfo?.airline ||
              this.bookingDetails.airportInfo?.airline;
            if (flightNumberDisney) {
              specialNotes.push(
                `VUELO: ${flightNumberDisney} - ${airlineDisney}`
              );
            }
          } else if (
            this.bookingDetails.expressTrip.pickupLocation === 'hotel'
          ) {
            specialNotes.push('TRANSPORTE DISNEY - Recogida en hotel');
            if (this.bookingDetails.pickupInfo?.hotelName) {
              specialNotes.push(
                `HOTEL: ${this.bookingDetails.pickupInfo.hotelName}`
              );
            }
          }
          break;
      }
    }

    // Add pickup information for regular transfers
    if (!this.bookingDetails?.expressTrip?.type) {
      if (this.bookingDetails?.pickupInfo?.type === 'airport') {
        const flightNumberRegular =
          this.bookingDetails.pickupInfo?.flightNumber ||
          this.bookingDetails.airportInfo?.flightNumber;
        const airlineRegular =
          this.bookingDetails.pickupInfo?.airline ||
          this.bookingDetails.airportInfo?.airline;
        if (flightNumberRegular) {
          specialNotes.push(
            `VUELO: ${flightNumberRegular} - ${airlineRegular}`
          );
        }

        const airport =
          this.bookingDetails.pickupInfo?.airport ||
          this.bookingDetails.airportInfo?.airport;
        if (airport) {
          specialNotes.push(`AEROPUERTO: ${airport}`);
        }

        const terminal =
          this.bookingDetails.pickupInfo?.terminal ||
          this.bookingDetails.airportInfo?.terminal;
        if (terminal) {
          specialNotes.push(`TERMINAL: ${terminal}`);
        }
      } else if (this.bookingDetails?.pickupInfo?.type === 'hotel') {
        if (this.bookingDetails.pickupInfo.hotelName) {
          specialNotes.push(
            `HOTEL: ${this.bookingDetails.pickupInfo.hotelName}`
          );
        }
        if (this.bookingDetails.pickupInfo.address) {
          specialNotes.push(
            `DIRECCIÓN: ${this.bookingDetails.pickupInfo.address}`
          );
        }
      }
    }

    return specialNotes.length > 0 ? specialNotes.join(' | ') : undefined;
  }

  // Utility methods
  close(): void {
    this.enableZoom(); // Restore zoom functionality
    this.closed.emit();
    this.resetModal();
    // Clear store state when explicitly closing
    this.clearStoreState();
  }

  private resetModal(): void {
    this.currentStep = 1;
    this.showConfirmation = false;
    this.isProcessingPayment = false;
    this.acceptedTerms = false;

    // Clear date format cache
    this.dateFormatCache.clear();

    // Reset form data - TEST DATA FOR DEVELOPMENT (REMOVE IN PRODUCTION)
    /* this.userInfo = {
      firstName: 'Juan Carlos',
      lastName: 'García López',
      email: 'juan.garcia@example.com',
      phone: '+34 612 345 678',
      nationality: 'España',
      dateOfBirth: '1985-03-15',
      passportNumber: 'P12345678',
      specialRequests: 'Asiento con vista, si es posible',
    }; */

    this.userInfo = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      dateOfBirth: '',
      passportNumber: '',
      specialRequests: '',
    };

    this.paymentMethod = {
      cardholderName: '',
    };
  }

  generateBookingId(): string {
    return 'MB' + Date.now().toString(36).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no disponible';

    // Check cache first to prevent recomputation
    if (this.dateFormatCache.has(dateString)) {
      return this.dateFormatCache.get(dateString)!;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const errorResult = 'Fecha inválida';
        this.dateFormatCache.set(dateString, errorResult);
        return errorResult;
      }

      const formattedDate = date.toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // Cache the result
      this.dateFormatCache.set(dateString, formattedDate);
      return formattedDate;
    } catch (error) {
      console.error(
        'Error formatting date:',
        error,
        'for dateString:',
        dateString
      );
      const errorResult = 'Error en fecha';
      this.dateFormatCache.set(dateString, errorResult);
      return errorResult;
    }
  }

  formatCurrency(amount: number): string {
    return '€' + amount.toFixed(2);
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES');
  }

  downloadConfirmation(): void {
    // Simulate PDF download
    const element = document.createElement('a');
    const bookingId = this.generateBookingId();
    element.download = `reserva-${bookingId}.pdf`;
    element.href = '#'; // In real implementation, generate PDF blob URL
    element.click();

    // Show feedback
    alert('Descarga iniciada. Recibirás también una copia por email.');
  }

  // Mobile-specific methods
  getStepTitle(): string {
    if (this.showConfirmation) {
      return 'Confirmación de Reserva';
    }

    switch (this.currentStep) {
      case 1:
        return 'Información Personal';
      case 2:
        return 'Resumen y Pago';
      default:
        return 'Confirmación';
    }
  }

  getProgressPercentage(): number {
    if (this.showConfirmation) return 100;
    return (this.currentStep / this.totalSteps) * 100;
  }

  // Store management methods
  private clearStoreState(): void {
    // Dispatch action to clear store state
    this.store.dispatch(LandingActions.clearReservation());

    // Clear component local state
    this.reservation = null;
    this.reservationError = null;
    this.confirmationProcessing = false; // Reset confirmation flag
    this.stripeSetupInitialized = false; // Reset Stripe setup flag
  }

  private setupStoreSubscriptions(): void {
    // Subscribe to reservation updates
    this.reservation$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((reservation) => {
        // Only show confirmation if we receive a NEW reservation after clearing state
        // and we're not already in confirmation mode
        if (
          reservation &&
          !this.reservation &&
          !this.showConfirmation &&
          !this.confirmationProcessing
        ) {
          this.confirmationProcessing = true; // Set flag to prevent clearing
          this.reservation = reservation;
          this.showConfirmation = true;
          this.isProcessingPayment = false;
          this.reservationError = null; // Clear any previous errors
        }
      });

    // Subscribe to processing state
    this.isProcessingReservation$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((isProcessing) => {
        this.isProcessingPayment = isProcessing || false;
      });

    // Subscribe to errors
    this.reservationError$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((error) => {
        if (error) {
          this.reservationError = error;
          this.isProcessingPayment = false;
          // Handle error display here
        }
      });
  }

  // Stripe setup methods
  private waitForElementAndSetupStripe(): void {
    // Don't setup if we're not on step 2 or if showing confirmation
    if (this.currentStep !== 2 || this.showConfirmation) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 20; // Try for up to 2 seconds (20 * 100ms)

    const checkElement = () => {
      const cardElement = document.getElementById('mobile-card-element');
      if (cardElement) {
        this.setupStripe();
      } else if (
        attempts < maxAttempts &&
        this.currentStep === 2 &&
        !this.showConfirmation
      ) {
        // If element doesn't exist yet, try again in 100ms
        attempts++;
        setTimeout(checkElement, 100);
      } else if (attempts >= maxAttempts) {
        console.warn('Mobile card element not found after maximum attempts');
      }
    };

    checkElement();
  }

  async setupStripe() {
    // Check if the card element exists in DOM before mounting
    const cardElement = document.getElementById('mobile-card-element');
    if (!cardElement) {
      return;
    }

    // Clean up existing Stripe elements before creating new ones
    if (this.card) {
      this.cleanupStripe();
    }

    const style = {
      base: {
        color: '#000000',
        fontSmoothing: 'antialiased',
        fontSize: '16px', // Smaller font for mobile
        fontFamily: '"Kanit Regular", sans-serif',
        '::placeholder': {
          color: '#474747',
        },
      },
      invalid: {
        color: '#dc3545',
        iconColor: '#dc3545',
      },
      valid: {
        color: '#000000',
        iconColor: '#000000',
      },
    };

    try {
      this.stripe = await this.stripeService.getStripe(this.isTesting);
      if (this.stripe) {
        this.elements = this.stripe.elements({
          locale: 'es', // Set the locale to Spanish
        });
        this.card = this.elements.create('card', {
          style,
          hidePostalCode: true, // Disable postal code field
        });
        this.card.mount('#mobile-card-element');

        // Add error event listener
        this.card.on('change', (event) => {
          if (event.error) {
            this.stripeError = this.translateStripeError(event.error.message);
          } else {
            this.stripeError = null;
          }
        });

        // Clear general errors when user starts interacting with card
        this.card.on('focus', () => {
          this.generalError = null;
          this.stripeError = null;
        });
      }
    } catch (error) {
      console.error('Error setting up mobile Stripe:', error);
      this.stripeError =
        'Error al configurar el sistema de pagos. Por favor, recarga la página e intenta de nuevo.';
    }
  }

  private cleanupStripe(): void {
    try {
      if (this.card) {
        this.card.unmount();
        this.card.destroy();
        this.card = null;
      }
      if (this.elements) {
        this.elements = null;
      }
      // Note: We don't null the stripe instance as it can be reused
      // this.stripe = null;
    } catch (error) {
      console.warn('Error cleaning up Stripe elements:', error);
      // Force reset even if unmount fails
      this.card = null;
      this.elements = null;
    }
  }

  ngOnDestroy(): void {
    this.cleanupHorizontalScrollPrevention();
    this.cleanupStripe();
    // Don't clear store state here as component might be rerendering
    // Only clear when explicitly closing the modal
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    // Clear date format cache to prevent memory leaks
    this.dateFormatCache.clear();
  }

  private cleanupHorizontalScrollPrevention(): void {
    // Remove the overflow prevention styles
    const existingStyle = document.getElementById(
      'mobile-modal-overflow-prevention'
    );
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  // Getters for thank-you component data
  get thankYouBookingDetails() {
    return {
      origin: this.bookingDetails?.origin,
      destination: this.bookingDetails?.destination,
      departureDate: this.bookingDetails?.departureDate,
      departureTime: this.bookingDetails?.departureTime,
      returnDate: this.bookingDetails?.returnDate,
      returnTime: this.bookingDetails?.returnTime,
      passengers: this.bookingDetails?.passengers,
      isRoundTrip: this.bookingDetails?.isRoundTrip,
      totalPrice: this.bookingDetails?.totalPrice,
      serviceFee: this.bookingDetails?.serviceFee,
      urgencyFee: this.bookingDetails?.urgencyFee,
      grandTotal: this.bookingDetails?.grandTotal,
      savings: this.bookingDetails?.savings,
      expressTrip: this.bookingDetails?.expressTrip,
      pickupInfo: this.bookingDetails?.pickupInfo,
      vans: this.bookingDetails?.vans,
      distance: this.bookingDetails?.distance,
      duration: this.bookingDetails?.duration,
    };
  }

  get thankYouUserInfo() {
    return {
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      email: this.userInfo.email,
      phone: this.userInfo.phone,
      nationality: this.userInfo.nationality,
      dateOfBirth: this.userInfo.dateOfBirth,
      passportNumber: this.userInfo.passportNumber,
      specialRequests: this.userInfo.specialRequests,
    };
  }

  get thankYouPaymentMethod() {
    return {
      cardholderName: this.paymentMethod.cardholderName,
      type: 'credit_card',
      last4: '****', // Stripe handles this securely - we don't store full card details
    };
  }

  get reservationData() {
    return this.reservation;
  }

  get paymentSuccessful(): boolean {
    return !!(this.reservation && !this.reservationError);
  }

  // Translate Stripe error messages to Spanish
  private translateStripeError(message: string): string {
    const translations: { [key: string]: string } = {
      // Card validation errors
      'Your card number is incomplete.':
        'El número de tarjeta está incompleto.',
      'Your card number is invalid.': 'El número de tarjeta no es válido.',
      "Your card's expiration date is incomplete.":
        'La fecha de vencimiento está incompleta.',
      "Your card's expiration date is invalid.":
        'La fecha de vencimiento no es válida.',
      "Your card's security code is incomplete.":
        'El código de seguridad está incompleto.',
      "Your card's security code is invalid.":
        'El código de seguridad no es válido.',
      'Your postal code is incomplete.': 'El código postal está incompleto.',
      'Your postal code is invalid.': 'El código postal no es válido.',

      // Payment processing errors
      'Your card was declined.':
        'Su tarjeta fue rechazada. Por favor, contacte a su banco o use otra tarjeta.',
      'Your card has insufficient funds.':
        'Su tarjeta no tiene fondos suficientes.',
      'Your card has expired.':
        'Su tarjeta ha vencido. Por favor, use una tarjeta válida.',
      "Your card's security code is incorrect.":
        'El código de seguridad de su tarjeta es incorrecto.',
      'Processing error': 'Error de procesamiento',

      // Specific Stripe error codes
      card_declined:
        'Su tarjeta fue rechazada. Por favor, contacte a su banco o use otra tarjeta.',
      insufficient_funds: 'Su tarjeta no tiene fondos suficientes.',
      lost_card:
        'Su tarjeta ha sido reportada como perdida. Contacte a su banco.',
      stolen_card:
        'Su tarjeta ha sido reportada como robada. Contacte a su banco.',
      expired_card: 'Su tarjeta ha vencido. Por favor, use una tarjeta válida.',
      incorrect_cvc: 'El código de seguridad (CVC) es incorrecto.',
      incorrect_number: 'El número de tarjeta es incorrecto.',
      invalid_expiry_month: 'El mes de vencimiento no es válido.',
      invalid_expiry_year: 'El año de vencimiento no es válido.',
    };

    // Check for live mode test card error (common Spanish message)
    if (
      message.includes('modo "directo"') &&
      message.includes('tarjeta de prueba')
    ) {
      return 'No se pueden usar tarjetas de prueba en el modo de pago real. Por favor, use una tarjeta válida.';
    }

    // Check for specific decline codes in the message
    if (message.includes('live_mode_test_card')) {
      return 'No se pueden usar tarjetas de prueba. Por favor, use una tarjeta válida.';
    }

    // Return translated message or original if not found
    return (
      translations[message] ||
      message ||
      'Error procesando el pago. Por favor, intente de nuevo.'
    );
  }

  // Clear all error messages
  clearErrors(): void {
    this.stripeError = null;
    this.generalError = null;
  }

  retryPayment(): void {
    // Clear store and reset states
    this.clearStoreState();
    this.resetModal();

    // Reset confirmation and processing flags
    this.showConfirmation = false;
    this.confirmationProcessing = false;
    this.isProcessingPayment = false;

    // Go back to payment step
    this.currentStep = 2;

    // Clean up existing Stripe elements
    this.cleanupStripe();

    // Reinitialize Stripe
    setTimeout(() => {
      this.waitForElementAndSetupStripe();
    }, 200);
  }
}
