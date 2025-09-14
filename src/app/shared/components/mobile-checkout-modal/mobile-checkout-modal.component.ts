import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
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
} from '@fortawesome/free-solid-svg-icons';

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

interface PaymentMethod {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

@Component({
  selector: 'app-mobile-checkout-modal',
  templateUrl: './mobile-checkout-modal.component.html',
  styleUrl: './mobile-checkout-modal.component.css',
})
export class MobileCheckoutModalComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() isVisible: boolean = false;
  @Input() bookingDetails: any = null;
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

  // Multi-step navigation
  currentStep: number = 1;
  totalSteps: number = 2;

  // Form data
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

  paymentMethod: PaymentMethod = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  };

  // State management
  isProcessingPayment: boolean = false;
  showConfirmation: boolean = false;
  acceptedTerms: boolean = false;

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

  constructor() {}

  ngOnInit(): void {
    // Set up viewport to prevent zoom when modal is visible
    if (this.isVisible) {
      this.disableZoom();
    }
    this.preventHorizontalScroll();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.disableZoom();
    } else {
      this.enableZoom();
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
          this.paymentMethod.cardholderName.trim() !== '' &&
          this.paymentMethod.cardNumber.trim() !== '' &&
          this.paymentMethod.expiryDate.trim() !== '' &&
          this.paymentMethod.cvv.trim() !== '' &&
          this.acceptedTerms
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
      this.paymentMethod.cardNumber.trim() !== '' &&
      this.paymentMethod.expiryDate.trim() !== '' &&
      this.paymentMethod.cvv.trim() !== '' &&
      this.acceptedTerms
    );
  }

  // Payment processing
  async processPayment(): Promise<void> {
    if (!this.validateAllInfo()) {
      return;
    }

    this.isProcessingPayment = true;

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Show confirmation
      this.showConfirmation = true;
      this.currentStep = this.totalSteps + 1; // Go beyond normal steps

      // Emit confirmation event
      const confirmationData = {
        bookingId: this.generateBookingId(),
        userInfo: this.userInfo,
        paymentMethod: {
          type: 'credit_card',
          last4: this.paymentMethod.cardNumber.slice(-4),
          cardholderName: this.paymentMethod.cardholderName,
        },
        bookingDetails: this.bookingDetails,
        confirmedAt: new Date().toISOString(),
      };

      this.bookingConfirmed.emit(confirmationData);
    } catch (error) {
      console.error('Payment processing error:', error);
      // Handle error (show error message, etc.)
    } finally {
      this.isProcessingPayment = false;
    }
  }

  // Utility methods
  close(): void {
    this.enableZoom(); // Restore zoom functionality
    this.closed.emit();
    this.resetModal();
  }

  private resetModal(): void {
    this.currentStep = 1;
    this.showConfirmation = false;
    this.isProcessingPayment = false;
    this.acceptedTerms = false;

    // Reset form data
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
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    };
  }

  generateBookingId(): string {
    return 'MB' + Date.now().toString(36).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  // Card number formatting
  formatCardNumber(): void {
    let value = this.paymentMethod.cardNumber.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.paymentMethod.cardNumber = value;
  }

  // Expiry date formatting
  formatExpiryDate(): void {
    let value = this.paymentMethod.expiryDate.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentMethod.expiryDate = value;
  }

  ngOnDestroy(): void {
    this.cleanupHorizontalScrollPrevention();
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
      cardNumber: this.paymentMethod.cardNumber,
      expiryDate: this.paymentMethod.expiryDate,
      cvv: this.paymentMethod.cvv,
    };
  }
}
