import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  faVanShuttle,
  faMapMarkerAlt,
  faFlagCheckered,
  faCalendarAlt,
  faClock,
  faUsers,
  faSearch,
  faWifi,
  faSnowflake,
  faShieldAlt,
  faStar,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';

interface VanType {
  id: string;
  name: string;
  capacity: number;
  priceEur: number;
  features: string[];
}

interface Route {
  id: string;
  origin: string;
  destination: string;
  duration: string;
  distance: string;
}

interface BookingCalculation {
  passengers: number;
  vans: VanRecommendation[];
  totalPrice: number;
  returnTotalPrice?: number;
  grandTotal?: number;
  savings?: number;
  isRoundTrip?: boolean;
}

interface VanRecommendation {
  van: VanType;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-mobile-van-transfer-hero',
  templateUrl: './mobile-van-transfer-hero.component.html',
  styleUrl: './mobile-van-transfer-hero.component.css',
})
export class MobileVanTransferHeroComponent implements OnInit, OnDestroy {
  // FontAwesome Icons
  faVanShuttle = faVanShuttle;
  faMapMarkerAlt = faMapMarkerAlt;
  faFlagCheckered = faFlagCheckered;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faUsers = faUsers;
  faSearch = faSearch;
  faWifi = faWifi;
  faSnowflake = faSnowflake;
  faShieldAlt = faShieldAlt;
  faStar = faStar;
  faBolt = faBolt;

  // Van Types Mock Data
  vanTypes: VanType[] = [
    {
      id: 'van4',
      name: 'Van Premium 4 Pasajeros',
      capacity: 4,
      priceEur: 550,
      features: [
        'WiFi Gratis',
        'Aire Acondicionado',
        'Equipaje Incluido',
        'Conductor Profesional',
      ],
    },
    {
      id: 'van6',
      name: 'Van Premium 6 Pasajeros',
      capacity: 6,
      priceEur: 650,
      features: [
        'WiFi Gratis',
        'Aire Acondicionado',
        'Equipaje Incluido',
        'Conductor Profesional',
        'Espacio Extra',
      ],
    },
  ];

  // Routes Mock Data
  availableRoutes: Route[] = [
    {
      id: 'paris-brujas',
      origin: 'París',
      destination: 'Brujas',
      duration: '3h 30min',
      distance: '302 km',
    },
    {
      id: 'brujas-paris',
      origin: 'Brujas',
      destination: 'París',
      duration: '3h 30min',
      distance: '302 km',
    },
    {
      id: 'paris-amsterdam',
      origin: 'París',
      destination: 'Ámsterdam',
      duration: '4h 15min',
      distance: '430 km',
    },
    {
      id: 'amsterdam-paris',
      origin: 'Ámsterdam',
      destination: 'París',
      duration: '4h 15min',
      distance: '430 km',
    },
    {
      id: 'paris-bruselas',
      origin: 'París',
      destination: 'Bruselas',
      duration: '3h 20min',
      distance: '265 km',
    },
    {
      id: 'bruselas-paris',
      origin: 'Bruselas',
      destination: 'París',
      duration: '3h 20min',
      distance: '265 km',
    },
  ];

  // Form Data
  selectedOrigin: string = '';
  selectedDestination: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedPassengers: number = 1;
  selectedRoute: Route | null = null;

  // Return trip data
  isRoundTrip: boolean = false;
  selectedReturnDate: string = '';
  selectedReturnTime: string = '';
  returnRoute: Route | null = null;

  // Results
  bookingCalculation: BookingCalculation | null = null;
  showResults: boolean = false;

  // Validation messages
  validationMessage: string = '';
  showValidationAlert: boolean = false;

  // Checkout modal
  showCheckoutModal: boolean = false;

  // Calendar constraints
  minDate: Date = new Date();
  minDateString: string = ''; // String version for HTML5 date inputs

  // Available time options
  times = [
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  constructor() {}

  ngOnInit(): void {
    this.disableZoom(); // Prevent double-tap zoom on mobile
    // Set minimum date to today
    const today = new Date();
    this.minDateString = today.toISOString().split('T')[0];

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate = tomorrow.toISOString().split('T')[0];

    // Set default return date to day after tomorrow
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    this.selectedReturnDate = dayAfterTomorrow.toISOString().split('T')[0];

    // Set default time to 10:00
    this.selectedTime = '10:00';
    this.selectedReturnTime = '10:00';
  }

  ngOnDestroy(): void {
    this.enableZoom(); // Restore zoom functionality
  }

  // Zoom prevention methods
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

  // Handle round trip toggle
  onRoundTripToggle(): void {
    if (this.isRoundTrip) {
      // Find return route
      if (this.selectedOrigin && this.selectedDestination) {
        this.returnRoute = this.findRoute(
          this.selectedDestination,
          this.selectedOrigin
        );
      }
      // Set default return date to one day after departure
      if (this.selectedDate) {
        const departureDate = new Date(this.selectedDate);
        departureDate.setDate(departureDate.getDate() + 1);
        this.selectedReturnDate = departureDate.toISOString().split('T')[0];
      }
    } else {
      this.returnRoute = null;
      this.selectedReturnDate = '';
    }
    this.showResults = false;
  }

  // Calculate the best van combination for passengers
  calculateVanRecommendation(passengers: number): BookingCalculation {
    if (passengers <= 0) {
      return {
        passengers: 0,
        vans: [],
        totalPrice: 0,
      };
    }

    const van4 = this.vanTypes.find((v) => v.capacity === 4)!;
    const van6 = this.vanTypes.find((v) => v.capacity === 6)!;

    let bestRecommendation: VanRecommendation[] = [];
    let lowestPrice = Infinity;

    // Strategy 1: Only 4-passenger vans
    const vans4Needed = Math.ceil(passengers / 4);
    const price4Only = vans4Needed * van4.priceEur;
    if (price4Only < lowestPrice) {
      lowestPrice = price4Only;
      bestRecommendation = [
        { van: van4, quantity: vans4Needed, price: price4Only },
      ];
    }

    // Strategy 2: Only 6-passenger vans
    const vans6Needed = Math.ceil(passengers / 6);
    const price6Only = vans6Needed * van6.priceEur;
    if (price6Only < lowestPrice) {
      lowestPrice = price6Only;
      bestRecommendation = [
        { van: van6, quantity: vans6Needed, price: price6Only },
      ];
    }

    // Strategy 3: Mix of 6 and 4 passenger vans
    if (passengers > 6) {
      const vans6ForMix = Math.floor(passengers / 6);
      const remainingPassengers = passengers - vans6ForMix * 6;
      const vans4ForMix =
        remainingPassengers > 0 ? Math.ceil(remainingPassengers / 4) : 0;
      const priceMix =
        vans6ForMix * van6.priceEur + vans4ForMix * van4.priceEur;

      if (priceMix < lowestPrice) {
        lowestPrice = priceMix;
        bestRecommendation = [];
        if (vans6ForMix > 0) {
          bestRecommendation.push({
            van: van6,
            quantity: vans6ForMix,
            price: vans6ForMix * van6.priceEur,
          });
        }
        if (vans4ForMix > 0) {
          bestRecommendation.push({
            van: van4,
            quantity: vans4ForMix,
            price: vans4ForMix * van4.priceEur,
          });
        }
      }
    }

    return {
      passengers,
      vans: bestRecommendation,
      totalPrice: lowestPrice,
    };
  }

  // Find route between origin and destination
  findRoute(origin: string, destination: string): Route | null {
    return (
      this.availableRoutes.find(
        (route) =>
          route.origin.toLowerCase() === origin.toLowerCase() &&
          route.destination.toLowerCase() === destination.toLowerCase()
      ) || null
    );
  }

  getAvailableOrigins(): string[] {
    return [...new Set(this.availableRoutes.map((r) => r.origin))];
  }

  getAvailableDestinations(): string[] {
    if (!this.selectedOrigin) return [];
    return this.availableRoutes
      .filter((r) => r.origin === this.selectedOrigin)
      .map((r) => r.destination);
  }

  onOriginChange(): void {
    this.selectedDestination = '';
    this.selectedRoute = null;
    this.showResults = false;
    this.hideValidationMessage();
  }

  onDestinationChange(): void {
    if (this.selectedOrigin && this.selectedDestination) {
      this.selectedRoute = this.findRoute(
        this.selectedOrigin,
        this.selectedDestination
      );
    }
    this.showResults = false;
  }

  onSearchTransfers(): void {
    if (
      !this.selectedOrigin ||
      !this.selectedDestination ||
      !this.selectedDate ||
      !this.selectedTime
    ) {
      this.showValidationMessage(
        'Por favor complete todos los campos requeridos'
      );
      return;
    }

    // Validate departure date/time is not in the past
    if (this.isDateTimeInPast(this.selectedDate, this.selectedTime)) {
      this.showValidationMessage(
        'La fecha y hora de salida no puede ser en el pasado'
      );
      return;
    }

    if (
      this.isRoundTrip &&
      (!this.selectedReturnDate || !this.selectedReturnTime)
    ) {
      this.showValidationMessage(
        'Por favor complete la fecha y hora de regreso'
      );
      return;
    }

    // Validate return date/time is not in the past (if round trip)
    if (
      this.isRoundTrip &&
      this.isDateTimeInPast(this.selectedReturnDate, this.selectedReturnTime)
    ) {
      this.showValidationMessage(
        'La fecha y hora de regreso no puede ser en el pasado'
      );
      return;
    }

    // Find outbound route
    this.selectedRoute = this.findRoute(
      this.selectedOrigin,
      this.selectedDestination
    );

    if (!this.selectedRoute) {
      this.showValidationMessage(
        'Lo sentimos, esta ruta no está disponible actualmente. Rutas disponibles: París-Brujas, París-Ámsterdam, París-Bruselas y sus rutas de regreso.'
      );
      return;
    }

    // Find return route if round trip
    if (this.isRoundTrip) {
      this.returnRoute = this.findRoute(
        this.selectedDestination,
        this.selectedOrigin
      );
      if (!this.returnRoute) {
        this.showValidationMessage(
          'Lo sentimos, la ruta de regreso no está disponible.'
        );
        return;
      }
    }

    // Calculate van recommendation
    this.bookingCalculation = this.calculateVanRecommendation(
      this.selectedPassengers
    );

    // Add round trip calculations
    if (this.isRoundTrip && this.bookingCalculation) {
      this.bookingCalculation.isRoundTrip = true;
      this.bookingCalculation.returnTotalPrice =
        this.bookingCalculation.totalPrice; // Same price for return
      this.bookingCalculation.grandTotal =
        this.bookingCalculation.totalPrice +
        this.bookingCalculation.returnTotalPrice;

      // Add 5% discount for round trips
      const discount = this.bookingCalculation.grandTotal * 0.05;
      this.bookingCalculation.savings = discount;
      this.bookingCalculation.grandTotal -= discount;
    }

    this.showResults = true;

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.querySelector('.booking-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Validate if selected date/time is not in the past
  isDateTimeInPast(date: string, time: string): boolean {
    if (!date || !time) return false;

    const selectedDateTime = new Date(date + 'T' + time);
    const now = new Date();

    return selectedDateTime < now;
  }

  private showValidationMessage(message: string): void {
    this.validationMessage = message;
    this.showValidationAlert = true;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.showValidationAlert = false;
    }, 5000);
  }

  hideValidationMessage(): void {
    this.showValidationAlert = false;
    this.validationMessage = '';
  }

  incrementPassengers(): void {
    if (this.selectedPassengers < 8) {
      this.selectedPassengers++;
    }
  }

  decrementPassengers(): void {
    if (this.selectedPassengers > 1) {
      this.selectedPassengers--;
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Checkout modal methods
  openCheckoutModal(): void {
    this.showCheckoutModal = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  onBookingConfirmed(confirmation: any): void {
    console.log('Mobile booking confirmed:', confirmation);
    // Here you would typically:
    // 1. Send confirmation to backend
    // 2. Send confirmation email
    // 3. Update user's booking history
    // 4. Show success message

    // For now, we'll just close the modal after a short delay
    setTimeout(() => {
      this.closeCheckoutModal();
      this.showResults = false;
      this.resetForm();
    }, 3000);
  }

  private resetForm(): void {
    this.selectedOrigin = '';
    this.selectedDestination = '';
    this.selectedPassengers = 1;
    this.isRoundTrip = false;
    this.bookingCalculation = null;

    // Reset dates to defaults
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate = tomorrow.toISOString().split('T')[0];

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    this.selectedReturnDate = dayAfterTomorrow.toISOString().split('T')[0];

    this.selectedTime = '10:00';
    this.selectedReturnTime = '10:00';
  }

  // Prepare booking details for checkout modal
  getBookingDetailsForCheckout(): any {
    if (!this.bookingCalculation || !this.selectedRoute) {
      return null;
    }

    return {
      bookingId: 'VT' + Date.now().toString(36).toUpperCase(),
      origin: this.selectedOrigin,
      destination: this.selectedDestination,
      departureDate: this.selectedDate,
      departureTime: this.selectedTime,
      returnDate: this.isRoundTrip ? this.selectedReturnDate : undefined,
      returnTime: this.isRoundTrip ? this.selectedReturnTime : undefined,
      passengers: this.selectedPassengers,
      vans: this.bookingCalculation.vans,
      totalPrice: this.bookingCalculation.totalPrice,
      returnTotalPrice: this.bookingCalculation.returnTotalPrice,
      grandTotal: this.bookingCalculation.grandTotal,
      savings: this.bookingCalculation.savings,
      isRoundTrip: this.isRoundTrip,
      duration: this.selectedRoute.duration,
      distance: this.selectedRoute.distance,
    };
  }
}
