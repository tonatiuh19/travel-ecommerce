import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
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
  returnTotalPrice?: number;
  grandTotal?: number;
  savings?: number;
  isRoundTrip: boolean;
  duration: string;
  distance: string;
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
export class CheckoutModalComponent implements OnInit, OnChanges {
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

  // Country list for nationality
  countries: string[] = [
    'España',
    'Francia',
    'Alemania',
    'Italia',
    'Portugal',
    'Reino Unido',
    'Estados Unidos',
    'Canadá',
    'México',
    'Argentina',
    'Brasil',
    'Chile',
    'Colombia',
    'Perú',
    'Japón',
    'China',
    'Australia',
    'Holanda',
    'Bélgica',
  ];

  ngOnInit(): void {
    this.initializePassengers();
  }

  ngOnChanges(): void {
    if (this.bookingDetails) {
      this.initializePassengers();
    }
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
    return this.validateUserInfo() && this.validatePaymentInfo();
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
    this.isProcessingPayment = true;

    try {
      // Log all collected information
      console.group('=== CHECKOUT INFORMATION ===');

      console.log('📋 User Information:', {
        firstName: this.userInfo.firstName,
        lastName: this.userInfo.lastName,
        email: this.userInfo.email,
        phone: this.userInfo.phone,
        nationality: this.userInfo.nationality,
        dateOfBirth: this.userInfo.dateOfBirth,
        passportNumber: this.userInfo.passportNumber,
        specialRequests: this.userInfo.specialRequests,
      });

      console.log('💳 Payment Method:', {
        type: this.paymentMethod.type,
        cardholderName: this.paymentMethod.cardholderName,
        cardNumber: this.paymentMethod.cardNumber
          ? `****-****-****-${this.paymentMethod.cardNumber.slice(-4)}`
          : null,
        expiryDate: this.paymentMethod.expiryDate,
      });

      console.log('🎫 Booking Details:', {
        origin: this.bookingDetails?.origin,
        destination: this.bookingDetails?.destination,
        departureDate: this.bookingDetails?.departureDate,
        departureTime: this.bookingDetails?.departureTime,
        returnDate: this.bookingDetails?.returnDate,
        returnTime: this.bookingDetails?.returnTime,
        passengers: this.bookingDetails?.passengers,
        isRoundTrip: this.bookingDetails?.isRoundTrip,
        vans: this.bookingDetails?.vans,
        totalPrice: this.bookingDetails?.totalPrice,
        returnTotalPrice: this.bookingDetails?.returnTotalPrice,
        grandTotal: this.bookingDetails?.grandTotal,
        savings: this.bookingDetails?.savings,
      });

      console.log('💰 Price Summary:', {
        totalPrice: this.formatCurrency(this.bookingDetails?.totalPrice || 0),
        returnTotalPrice: this.bookingDetails?.returnTotalPrice
          ? this.formatCurrency(this.bookingDetails.returnTotalPrice)
          : 'N/A',
        savings: this.bookingDetails?.savings
          ? this.formatCurrency(this.bookingDetails.savings)
          : 'N/A',
        grandTotal: this.formatCurrency(
          this.bookingDetails?.grandTotal ||
            this.bookingDetails?.totalPrice ||
            0
        ),
      });

      console.groupEnd();

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const bookingConfirmation = {
        bookingId: this.generateBookingId(),
        userInfo: this.userInfo,
        bookingDetails: this.bookingDetails,
        paymentMethod: {
          type: this.paymentMethod.type,
          last4: this.paymentMethod.cardNumber?.slice(-4),
          cardholderName: this.paymentMethod.cardholderName,
        },
        totalAmount:
          this.bookingDetails?.grandTotal ||
          this.bookingDetails?.totalPrice ||
          0,
        confirmationDate: new Date().toISOString(),
        status: 'confirmed',
      };

      console.log('✅ BOOKING CONFIRMED:', bookingConfirmation);

      this.showConfirmation = true;
      this.bookingConfirmed.emit(bookingConfirmation);
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      alert('Error al procesar el pago. Por favor, inténtelo de nuevo.');
    } finally {
      this.isProcessingPayment = false;
    }
  }

  generateBookingId(): string {
    return 'VT' + Date.now().toString(36).toUpperCase();
  }

  // Modal control
  close(): void {
    if (!this.isProcessingPayment) {
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
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Download confirmation
  downloadConfirmation(): void {
    // In a real app, this would generate and download a PDF
    console.log('Downloading confirmation...');
    alert('Descarga de confirmación iniciada');
  }

  // Get current date formatted
  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES');
  }
}
