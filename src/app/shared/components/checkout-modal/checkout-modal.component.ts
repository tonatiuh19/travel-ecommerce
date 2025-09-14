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
  faTimes,
  faUserCircle,
  faCreditCard,
  faCheck,
  faLock,
  faSpinner,
  faCheckCircle,
  faDownload,
  faHome,
  faReceipt,
  faArrowRight,
  faArrowLeft,
  faPlaneDeparture,
  faPlaneArrival,
  faUsers,
  faUserCheck,
  faVanShuttle,
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

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber?: string;
  nationality: string;
  dateOfBirth: string;
  specialRequests?: string;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  age: number;
  seatPreference?: string;
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
}

interface PaymentMethod {
  type: 'credit';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

@Component({
  selector: 'app-checkout-modal',
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.css'],
})
export class CheckoutModalComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() isVisible: boolean = false;
  @Input() bookingDetails: BookingDetails | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() bookingConfirmed = new EventEmitter<any>();

  // Form steps - Single step checkout
  currentStep: number = 1;
  totalSteps: number = 1;

  // User information
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

  // Passenger information (for multiple passengers)
  passengers: PassengerInfo[] = [];

  // Payment information
  paymentMethod: PaymentMethod = {
    type: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  };

  // Form validation
  userFormValid: boolean = false;
  passengerFormValid: boolean = false;
  paymentFormValid: boolean = false;

  // UI states
  isProcessingPayment: boolean = false;
  showConfirmation: boolean = false;
  private confirmationProcessing: boolean = false; // Flag to prevent state clearing during confirmation flow
  private stripeSetupInitialized: boolean = false; // Flag to prevent Stripe setup loop

  // Store observables
  reservation$ = this.store.select(selectReservation);
  isProcessingReservation$ = this.store.select(selectIsProcessingReservation);
  reservationError$ = this.store.select(selectReservationError);

  // Store data
  reservation: any = null;
  reservationError: any = null;

  // FontAwesome Icons
  faTimes = faTimes;
  faUserCircle = faUserCircle;
  faCreditCard = faCreditCard;
  faCheck = faCheck;
  faLock = faLock;
  faSpinner = faSpinner;
  faCheckCircle = faCheckCircle;
  faDownload = faDownload;
  faHome = faHome;
  faReceipt = faReceipt;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faPlaneDeparture = faPlaneDeparture;
  faPlaneArrival = faPlaneArrival;
  faUsers = faUsers;
  faUserCheck = faUserCheck;
  faVanShuttle = faVanShuttle;

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

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;

  private isTesting = false;

  private unsubscribe$ = new Subject<void>();

  constructor(private stripeService: StripeService, private store: Store) {
    // Initialize with default state to ensure form is shown first
    this.showConfirmation = false;
    this.confirmationProcessing = false;
    this.reservation = null;
    this.reservationError = null;
    this.stripeSetupInitialized = false;
  }

  private clearStoreState(): void {
    console.log('🧹 Clearing store state...');

    // Clear any previous reservation data from the store
    this.store.dispatch(LandingActions.clearReservation());

    // Reset local state
    this.reservation = null;
    this.reservationError = null;
    this.showConfirmation = false;
    this.isProcessingPayment = false;
    this.confirmationProcessing = false; // Reset confirmation flag
    this.stripeSetupInitialized = false; // Reset Stripe setup flag

    console.log('✅ Store state cleared');
  }

  private setupStoreSubscriptions(): void {
    // Subscribe to reservation success
    this.reservation$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((reservation) => {
        if (reservation && !this.reservation) {
          console.log('💡 Reservation received from store:', reservation);
          this.confirmationProcessing = true; // Set flag to prevent clearing
          this.reservation = reservation;
          this.showConfirmation = true;
          this.isProcessingPayment = false;
          this.reservationError = null; // Clear any previous errors

          console.log('✅ Payment successful - showing confirmation screen');
          // Don't emit bookingConfirmed to prevent parent from resetting the form and causing page refresh
          // The thank-you component will handle the success display
        }
      });

    // Subscribe to processing state
    this.isProcessingReservation$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((isProcessing) => {
        this.isProcessingPayment = isProcessing || false;
      });

    // Subscribe to reservation errors
    this.reservationError$
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((error) => {
        if (error && !this.reservationError) {
          console.log('❌ Error received from store:', error);
          this.confirmationProcessing = true; // Set flag to prevent clearing
          this.reservationError = error;
          this.isProcessingPayment = false;
          this.reservation = null; // Clear any previous reservation
          console.error('❌ Reservation failed:', error);

          // Show confirmation screen with error state
          this.showConfirmation = true;
        }
      });
  }

  ngOnInit(): void {
    this.initializePassengers();
    // Clear any existing store state BEFORE setting up subscriptions
    this.clearStoreState();

    // Add a small delay to ensure the store is cleared before subscribing
    setTimeout(() => {
      this.setupStoreSubscriptions();
    }, 100);
  }

  ngOnChanges(): void {
    if (this.bookingDetails) {
      this.initializePassengers();
    }

    // Setup Stripe only when modal becomes visible for the first time and hasn't been initialized yet
    if (
      this.isVisible &&
      !this.showConfirmation &&
      !this.confirmationProcessing &&
      !this.stripeSetupInitialized
    ) {
      console.log('🔄 Modal becoming visible - setting up Stripe...');
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

  private waitForElementAndSetupStripe(): void {
    const checkElement = () => {
      const cardElement = document.getElementById('card-element');
      if (cardElement && !this.card) {
        this.setupStripe();
      } else if (!cardElement && !this.showConfirmation) {
        // If element doesn't exist yet, try again in 100ms
        setTimeout(checkElement, 100);
      }
    };

    checkElement();
  }

  ngOnDestroy(): void {
    this.cleanupStripe();
    // Don't clear store state here as component might be rerendering
    // Only clear when explicitly closing the modal
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async setupStripe() {
    // Check if the card element exists in DOM before mounting
    const cardElement = document.getElementById('card-element');
    if (!cardElement) {
      console.warn('Card element not found in DOM, skipping Stripe setup');
      return;
    }

    // If Stripe is already initialized, don't initialize again
    if (this.card) {
      console.log('Stripe already initialized');
      return;
    }

    const style = {
      base: {
        color: '#000000',
        fontSmoothing: 'antialiased',
        fontSize: '18px',
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
        this.card.mount('#card-element');
        console.log('Stripe card element mounted successfully');
      }
    } catch (error) {
      console.error('Error setting up Stripe:', error);
    }
  }

  async handlePayment() {
    if (!this.stripe || !this.card) {
      return;
    }

    const { token, error } = await this.stripe.createToken(this.card);

    //if (this.purchaseForm.valid) {
    //this.isLoadingCheckout = true;
    if (error) {
      /*this.isStripeError = true;
        this.stripeErrorMessage = error.message || '';*/
    } else {
      //this.isStripeError = false;

      console.log('Token generated', token);
      /* this.store.dispatch(
          LandingActions.insertPurchase({
            id_books: this.book.id_books,
            name: this.purchaseForm.get('name')?.value,
            email: this.purchaseForm.get('email')?.value,
            price: this.bookPrice.toString(),
            token: token.id,
            payment_type: 'stripe',
          })
        );*/
    }
    /*} else {
      this.isLoadingCheckout = false;
      this.purchaseForm.markAllAsTouched();
    }*/
  }

  private initializePassengers(): void {
    if (this.bookingDetails) {
      this.passengers = Array(this.bookingDetails.passengers)
        .fill(null)
        .map((_, index) => ({
          firstName: '',
          lastName: '',
          age: 25,
          seatPreference: index === 0 ? 'window' : 'any',
        }));
    }
  }

  // Navigation methods
  nextStep(): void {
    if (this.canProceedToNext()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.canAccessStep(step)) {
      this.currentStep = step;
    }
  }

  canProceedToNext(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateUserInfo();
      default:
        return false;
    }
  }

  private canAccessStep(step: number): boolean {
    switch (step) {
      case 1:
        return true;
      case 2:
        return this.validateUserInfo();
      default:
        return false;
    }
  }

  // Validation methods for single-step checkout
  validateAllInfo(): boolean {
    return this.validateUserInfo();
  }

  private validateUserInfo(): boolean {
    return !!(
      this.userInfo.firstName &&
      this.userInfo.lastName &&
      this.userInfo.email &&
      this.userInfo.phone &&
      this.userInfo.nationality &&
      this.isValidEmail(this.userInfo.email)
    );
  }

  private validatePassengerInfo(): boolean {
    return this.passengers.every(
      (passenger) =>
        passenger.firstName && passenger.lastName && passenger.age > 0
    );
  }

  validatePaymentInfo(): boolean {
    return !!(
      this.paymentMethod.cardNumber &&
      this.paymentMethod.expiryDate &&
      this.paymentMethod.cvv &&
      this.paymentMethod.cardholderName
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Payment processing
  async processPayment(): Promise<void> {
    if (!this.stripe || !this.card) {
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
        console.error('Stripe token error:', error);
        return;
      }

      console.log('Token generated successfully:', token.id);

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
        pickup_airport: this.bookingDetails?.pickupInfo?.airport || undefined,
        pickup_flight_number:
          this.bookingDetails?.pickupInfo?.flightNumber || undefined,
        pickup_airline: this.bookingDetails?.pickupInfo?.airline || undefined,
        pickup_terminal: this.bookingDetails?.pickupInfo?.terminal || undefined,
        pickup_hotel_name:
          this.bookingDetails?.pickupInfo?.type === 'hotel'
            ? this.bookingDetails?.pickupInfo?.hotelName
            : undefined,
        pickup_address: this.bookingDetails?.pickupInfo?.address || undefined,
        wheelchair_access: 0, // Add if needed
        status: 'confirmed',
      };

      console.group('=== SENDING RESERVATION TO API ===');
      console.log('📋 User Info:', userInfo);
      console.log('🎫 Reservation Info:', reservationInfo);
      console.log('💳 Token:', token.id);
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
      console.error('❌ Payment processing failed:', error);
      this.isProcessingPayment = false;
    }
  }

  generateBookingId(): string {
    return 'VT' + Date.now().toString(36).toUpperCase();
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
      const arrivalTime = this.bookingDetails?.pickupInfo?.flightArrivalTime;
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
        const arrivalTime = this.bookingDetails?.pickupInfo?.flightArrivalTime;
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
          if (this.bookingDetails.pickupInfo?.flightNumber) {
            specialNotes.push(
              `VUELO: ${this.bookingDetails.pickupInfo.flightNumber} - ${this.bookingDetails.pickupInfo.airline}`
            );
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
          if (this.bookingDetails.pickupInfo?.flightNumber) {
            specialNotes.push(
              `VUELO LLEGADA: ${this.bookingDetails.pickupInfo.flightNumber} - ${this.bookingDetails.pickupInfo.airline}`
            );
          }
          break;

        case 'disney-transfer':
          if (this.bookingDetails.expressTrip.pickupLocation === 'airport') {
            specialNotes.push('TRANSPORTE DISNEY - Recogida en aeropuerto');
            if (this.bookingDetails.pickupInfo?.flightNumber) {
              specialNotes.push(
                `VUELO: ${this.bookingDetails.pickupInfo.flightNumber} - ${this.bookingDetails.pickupInfo.airline}`
              );
            }
          } else {
            specialNotes.push('TRANSPORTE DISNEY - Recogida en hotel');
            if (this.bookingDetails.pickupInfo?.hotelName) {
              specialNotes.push(
                `HOTEL: ${this.bookingDetails.pickupInfo.hotelName}`
              );
            }
          }
          break;
      }
    } else {
      // Regular van transfer
      if (this.bookingDetails?.destination === 'Ámsterdam') {
        specialNotes.push(
          'TRANSFER AMSTERDAM - SOLO IDA (regreso no incluido)'
        );
      } else {
        specialNotes.push(
          `TRANSFER REGULAR ${this.bookingDetails?.origin} ⇄ ${this.bookingDetails?.destination} - IDA Y VUELTA`
        );
      }

      if (
        this.bookingDetails?.pickupInfo?.type === 'airport' &&
        this.bookingDetails?.pickupInfo?.flightNumber
      ) {
        specialNotes.push(
          `VUELO: ${this.bookingDetails.pickupInfo.flightNumber} - ${this.bookingDetails.pickupInfo.airline}`
        );
      } else if (
        this.bookingDetails?.pickupInfo?.type === 'hotel' &&
        this.bookingDetails?.pickupInfo?.hotelName
      ) {
        specialNotes.push(`HOTEL: ${this.bookingDetails.pickupInfo.hotelName}`);
      }
    }

    // Add pickup location details
    if (this.bookingDetails?.pickupInfo?.address) {
      specialNotes.push(`DIRECCIÓN: ${this.bookingDetails.pickupInfo.address}`);
    }

    if (this.bookingDetails?.pickupInfo?.terminal) {
      specialNotes.push(`TERMINAL: ${this.bookingDetails.pickupInfo.terminal}`);
    }

    console.log('Built special notes:', specialNotes);
    return specialNotes.length > 0 ? specialNotes.join(' | ') : undefined;
  }

  // Modal control
  close(): void {
    if (!this.isProcessingPayment) {
      this.clearStoreState(); // Clear store immediately
      this.resetForm();
      this.closeModal.emit();
    }
  }

  private resetForm(): void {
    this.currentStep = 1;
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
    this.passengers = [];
    this.paymentMethod = { type: 'credit' };
    this.showConfirmation = false;
    this.isProcessingPayment = false;
    this.reservation = null;
    this.reservationError = null;
    this.confirmationProcessing = false; // Reset confirmation flag
    this.stripeSetupInitialized = false; // Reset Stripe setup flag

    // Clear reservation state from store
    this.store.dispatch(LandingActions.clearReservation());

    // Clean up existing Stripe elements
    this.cleanupStripe();

    // Reinitialize Stripe after the DOM has updated
    setTimeout(() => {
      this.waitForElementAndSetupStripe();
    }, 200);
  }

  private cleanupStripe(): void {
    if (this.card) {
      this.card.unmount();
      this.card = null;
    }
    if (this.elements) {
      this.elements = null;
    }
  }

  // Utility methods
  getStepTitle(): string {
    const titles = ['Información Personal', 'Pago y Confirmación'];
    return titles[this.currentStep - 1] || '';
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    if (!dateString) {
      return 'Fecha no disponible';
    }

    console.log('Formatting date:', dateString); // Debug log

    try {
      // Parse the date string as a local date to avoid timezone issues
      // The dateString is in format YYYY-MM-DD
      const dateParts = dateString.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
        const day = parseInt(dateParts[2]);

        const date = new Date(year, month, day);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'Fecha inválida';
        }

        const formattedDate = date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        console.log('Formatted date result:', formattedDate); // Debug log
        return formattedDate;
      } else {
        // Fallback to regular Date parsing
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'Fecha inválida';
        }

        return date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    } catch (error) {
      console.error(
        'Error formatting date:',
        error,
        'for dateString:',
        dateString
      );
      return 'Error en fecha';
    }
  }

  // Download confirmation
  downloadConfirmation(): void {
    // In a real app, this would generate and download a PDF
    console.log('Downloading confirmation...');
  }

  // Get current date formatted
  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES');
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
      // Add reservation-specific data
      reservationCode: this.reservation?.reservation?.reservation_code,
      reservationId: this.reservation?.reservation?.id,
      userId: this.reservation?.user_id,
      stripeId: this.reservation?.stripe_id,
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
      cardNumber: this.paymentMethod.cardNumber,
      expiryDate: this.paymentMethod.expiryDate,
      cvv: this.paymentMethod.cvv,
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
    this.resetForm();

    // Reinitialize Stripe
    setTimeout(() => {
      this.waitForElementAndSetupStripe();
    }, 200);
  }
}
