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

  // Multi-step navigation
  currentStep: number = 1;
  totalSteps: number = 2;

  // Form data - TEST DATA FOR DEVELOPMENT (REMOVE IN PRODUCTION)
  userInfo: UserInfo = {
    firstName: 'Juan Carlos',
    lastName: 'García López',
    email: 'juan.garcia@example.com',
    phone: '+34 612 345 678',
    nationality: 'España',
    dateOfBirth: '1985-03-15',
    passportNumber: 'P12345678',
    specialRequests: 'Asiento con vista, si es posible',
  };

  /*userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    passportNumber: '',
    specialRequests: '',
  };*/

  paymentMethod: PaymentMethod = {
    cardholderName: '',
  };

  // State management
  isProcessingPayment: boolean = false;
  showConfirmation: boolean = false;
  acceptedTerms: boolean = false;
  private confirmationProcessing: boolean = false; // Flag to prevent state clearing during confirmation flow
  private stripeSetupInitialized: boolean = false; // Flag to prevent Stripe setup loop

  // Stripe integration
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;
  private isTesting: boolean = false; // Set to true for testing environment

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
    } else {
      this.enableZoom();
    }

    // Debug Disney transfer data
    if (
      this.isVisible &&
      this.bookingDetails?.expressTrip?.type === 'disney-transfer'
    ) {
      console.log('🏰 Disney Transfer Debug - Mobile Modal:', {
        expressTrip: this.bookingDetails.expressTrip,
        pickupInfo: this.bookingDetails.pickupInfo,
        airportInfo: this.bookingDetails.airportInfo,
      });

      // Additional debug for hotel information
      if (this.bookingDetails.expressTrip.pickupLocation === 'hotel') {
        console.log('🏨 Hotel Pickup Debug:', {
          hasPickupInfo: !!this.bookingDetails.pickupInfo,
          pickupType: this.bookingDetails.pickupInfo?.type,
          hotelName: this.bookingDetails.pickupInfo?.hotelName,
          hotelAddress: this.bookingDetails.pickupInfo?.address,
        });
      }
    }

    // Debug airplane information for all services
    if (this.isVisible && this.bookingDetails) {
      console.log('✈️ Airplane Info Debug - Mobile Modal:', {
        serviceType:
          this.bookingDetails.expressTrip?.type || 'regular-transfer',
        pickupLocation: this.bookingDetails.expressTrip?.pickupLocation,
        hasAirportInfo: !!this.bookingDetails.airportInfo,
        hasPickupInfo: !!this.bookingDetails.pickupInfo,
        pickupType: this.bookingDetails.pickupInfo?.type,
        airportInfo: this.bookingDetails.airportInfo,
        pickupInfoAirport: this.bookingDetails.pickupInfo?.airport,
        shouldShowAirplaneInfo:
          (this.bookingDetails?.expressTrip?.type === 'paris-tour-4h' ||
            (this.bookingDetails?.expressTrip?.type === 'disney-transfer' &&
              this.bookingDetails?.expressTrip?.pickupLocation === 'airport') ||
            this.bookingDetails?.expressTrip?.type ===
              'airport-hotel-airport' ||
            this.bookingDetails?.pickupInfo?.type === 'airport') &&
          (this.bookingDetails?.airportInfo || this.bookingDetails?.pickupInfo),
      });

      // Debug return trip information for airport-hotel-airport services
      if (this.bookingDetails.expressTrip?.type === 'airport-hotel-airport') {
        console.log('🔄 Return Trip Debug - Mobile Modal:', {
          isRoundTrip: this.bookingDetails.expressTrip?.isRoundTrip,
          returnDate: this.bookingDetails.returnDate,
          returnPickupTime: this.bookingDetails.expressTrip?.returnPickupTime,
          returnTime: this.bookingDetails.returnTime,
          hotelName: this.bookingDetails.pickupInfo?.hotelName,
          shouldShowReturnTrip: !!(
            this.bookingDetails?.expressTrip?.isRoundTrip &&
            (this.bookingDetails?.returnDate ||
              this.bookingDetails?.expressTrip?.returnPickupTime)
          ),
        });
      }
    }

    // Setup Stripe only when modal becomes visible for the first time and hasn't been initialized yet
    if (
      this.isVisible &&
      !this.showConfirmation &&
      !this.confirmationProcessing &&
      !this.stripeSetupInitialized
    ) {
      console.log('🔄 Mobile modal becoming visible - setting up Stripe...');
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
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
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
      this.paymentMethod.cardholderName.trim() !== '' &&
      this.acceptedTerms
    );
  }

  // Payment processing
  async processPayment(): Promise<void> {
    if (!this.stripe || !this.card) {
      console.error('Mobile Stripe not initialized');
      return;
    }

    if (!this.validateAllInfo()) {
      alert('Por favor, complete toda la información requerida.');
      return;
    }

    try {
      // Create Stripe token
      const { token, error } = await this.stripe.createToken(this.card);

      if (error) {
        console.error('Mobile Stripe token error:', error);
        return;
      }

      console.log('Mobile token generated successfully:', token.id);

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

      console.group('=== SENDING MOBILE RESERVATION TO API ===');
      console.log('📋 User Info:', userInfo);
      console.log('🎫 Reservation Info:', reservationInfo);
      console.log('💳 Token:', token.id);

      // Debug hotel name specifically for airport-hotel-airport services
      if (this.bookingDetails?.expressTrip?.type === 'airport-hotel-airport') {
        console.log('🏨 Hotel Name Debug:', {
          pickupType: this.bookingDetails?.pickupInfo?.type,
          hotelName: this.bookingDetails?.pickupInfo?.hotelName,
          pickupHotelNameInAPI: reservationInfo.pickup_hotel_name,
          shouldIncludeHotel: !!this.bookingDetails?.pickupInfo?.hotelName,
        });
      }

      console.groupEnd();

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
      console.error('❌ Mobile payment processing failed:', error);
      this.isProcessingPayment = false;
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
        console.log(
          `Using flight arrival time for ${this.bookingDetails.expressTrip.type}:`,
          arrivalTime
        );
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
          console.log(
            'Using flight arrival time for Disney transfer from airport:',
            arrivalTime
          );
          return `${this.bookingDetails.departureDate} ${arrivalTime}`;
        }
      } else {
        // Disney transfer from hotel - use departure time
        const time = this.bookingDetails?.departureTime;
        if (time) {
          console.log(
            'Using departure time for Disney transfer from hotel:',
            time
          );
          return `${this.bookingDetails.departureDate} ${time}`;
        }
      }
    }

    // For regular transfers, use departure time
    const time = this.bookingDetails?.departureTime;
    if (time) {
      console.log('Using departure time for regular transfer:', time);
      return `${this.bookingDetails.departureDate} ${time}`;
    }

    console.warn('No valid time found, using default 10:00');
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
        console.log(
          'Using return pickup time for airport-hotel-airport service:',
          this.bookingDetails.expressTrip.returnPickupTime
        );
        return `${this.bookingDetails.returnDate} ${this.bookingDetails.expressTrip.returnPickupTime}`;
      }
    }

    // For regular transfers with return (not Amsterdam)
    if (
      this.bookingDetails?.returnDate &&
      this.bookingDetails?.returnTime &&
      this.bookingDetails?.destination !== 'Ámsterdam'
    ) {
      console.log(
        'Using return time for regular transfer:',
        this.bookingDetails.returnTime
      );
      return `${this.bookingDetails.returnDate} ${this.bookingDetails.returnTime}`;
    }

    // Paris tour and Disney transfer don't have return trips
    if (
      this.bookingDetails?.expressTrip?.type === 'paris-tour-4h' ||
      this.bookingDetails?.expressTrip?.type === 'disney-transfer'
    ) {
      console.log(`No return trip for ${this.bookingDetails.expressTrip.type}`);
      return undefined;
    }

    // Amsterdam transfers are one-way only
    if (this.bookingDetails?.destination === 'Ámsterdam') {
      console.log('Amsterdam transfer is one-way only');
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
    this.userInfo = {
      firstName: 'Juan Carlos',
      lastName: 'García López',
      email: 'juan.garcia@example.com',
      phone: '+34 612 345 678',
      nationality: 'España',
      dateOfBirth: '1985-03-15',
      passportNumber: 'P12345678',
      specialRequests: 'Asiento con vista, si es posible',
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
    console.log('🧹 Clearing mobile checkout store state...');

    // Dispatch action to clear store state
    this.store.dispatch(LandingActions.clearReservation());

    // Clear component local state
    this.reservation = null;
    this.reservationError = null;
    this.confirmationProcessing = false; // Reset confirmation flag
    this.stripeSetupInitialized = false; // Reset Stripe setup flag

    console.log('✅ Store state cleared');
  }

  private setupStoreSubscriptions(): void {
    console.log('📡 Setting up mobile checkout store subscriptions...');

    // Subscribe to reservation updates
    this.reservation$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((reservation) => {
        console.log('📦 Mobile reservation update received:', reservation);
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

          console.log('✅ Payment successful - showing confirmation screen');
        }
      });

    // Subscribe to processing state
    this.isProcessingReservation$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((isProcessing) => {
        console.log('⏳ Mobile processing state:', isProcessing);
        this.isProcessingPayment = isProcessing || false;
      });

    // Subscribe to errors
    this.reservationError$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((error) => {
        if (error) {
          console.error('❌ Mobile reservation error:', error);
          this.reservationError = error;
          this.isProcessingPayment = false;
          // Handle error display here
        }
      });
  }

  // Stripe setup methods
  private waitForElementAndSetupStripe(): void {
    const checkElement = () => {
      const cardElement = document.getElementById('mobile-card-element');
      if (cardElement && !this.card) {
        this.setupStripe();
      } else if (!cardElement && !this.showConfirmation) {
        // If element doesn't exist yet, try again in 100ms
        setTimeout(checkElement, 100);
      }
    };

    checkElement();
  }

  async setupStripe() {
    // Check if the card element exists in DOM before mounting
    const cardElement = document.getElementById('mobile-card-element');
    if (!cardElement) {
      console.warn(
        'Mobile card element not found in DOM, skipping Stripe setup'
      );
      return;
    }

    // If Stripe is already initialized, don't initialize again
    if (this.card) {
      console.log('Mobile Stripe already initialized');
      return;
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
        this.card = this.elements.create('card', { style });
        this.card.mount('#mobile-card-element');
        console.log('Mobile Stripe card element mounted successfully');
      }
    } catch (error) {
      console.error('Error setting up mobile Stripe:', error);
    }
  }

  private cleanupStripe(): void {
    if (this.card) {
      this.card.unmount();
      this.card = null;
    }
    this.elements = null;
    this.stripe = null;
    console.log('Mobile Stripe cleaned up');
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
