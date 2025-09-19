import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class ThankYouComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() paymentSuccessful: boolean = true;
  @Input() bookingDetails: BookingDetails | null = null;
  @Input() userInfo: UserInfo = {};
  @Input() paymentMethod: PaymentMethod = {};
  @Input() reservationData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() downloadConfirmation = new EventEmitter<void>();
  @Output() tryAgain = new EventEmitter<void>();

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

  ngOnInit(): void {
    this.confirmationNumber = this.generateConfirmationNumber();
  }

  generateConfirmationNumber(): string {
    if (this.reservationData?.reservation?.reservation_code) {
      return this.reservationData.reservation.reservation_code;
    }
    return '';
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
    this.closed.emit();
  }

  onDownloadConfirmation() {
    this.downloadConfirmation.emit();
  }

  onTryAgain() {
    this.tryAgain.emit();
  }
}
