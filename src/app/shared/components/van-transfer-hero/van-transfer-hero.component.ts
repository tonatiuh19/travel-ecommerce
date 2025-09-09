import { Component, OnInit } from '@angular/core';

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
  selector: 'app-van-transfer-hero',
  templateUrl: './van-transfer-hero.component.html',
  styleUrls: ['./van-transfer-hero.component.css'],
})
export class VanTransferHeroComponent implements OnInit {
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
  benefits = [
    {
      icon: 'fas fa-shield-alt',
      title: 'Viaje Seguro',
      description:
        'Conductores certificados y vehículos inspeccionados regularmente',
    },
    {
      icon: 'fas fa-clock',
      title: 'Puntualidad',
      description: 'Llegamos siempre a tiempo, monitoreo GPS en tiempo real',
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Mejor Precio',
      description:
        'Tarifas competitivas con descuentos por reservas anticipadas',
    },
    {
      icon: 'fas fa-headset',
      title: 'Soporte 24/7',
      description: 'Atención al cliente disponible las 24 horas del día',
    },
  ];

  testimonials = [
    {
      name: 'María González',
      rating: 5,
      comment: 'Excelente servicio, muy puntuales y cómodo. Lo recomiendo 100%',
      image: 'https://garbrix.com/assets/img/gallery/author-1.png',
    },
    {
      name: 'Carlos Mendez',
      rating: 5,
      comment:
        'Perfecto para viajes familiares, van espaciosa y conductor muy amable',
      image: 'https://garbrix.com/assets/img/gallery/author-2.png',
    },
    {
      name: 'Ana Rodríguez',
      rating: 4,
      comment:
        'Buen servicio y precio justo. Definitivamente lo usaré de nuevo',
      image: 'https://garbrix.com/assets/img/gallery/author-3.png',
    },
  ];

  constructor() {}

  ngOnInit(): void {
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

  // Handle departure date change for round trip validation
  onDepartureDateChange(): void {
    // Clear results when changing dates
    this.showResults = false;
    this.hideValidationMessage();

    // If return date is earlier than departure date, reset it
    if (
      this.selectedReturnDate &&
      this.selectedDate &&
      this.selectedReturnDate < this.selectedDate
    ) {
      const departureDate = new Date(this.selectedDate);
      departureDate.setDate(departureDate.getDate() + 1);
      this.selectedReturnDate = departureDate.toISOString().split('T')[0];
    }

    // Validate return time if same day
    this.validateReturnTime();
  }

  // Handle departure time change
  onDepartureTimeChange(): void {
    // Clear results when changing times
    this.showResults = false;
    this.hideValidationMessage();

    // Validate return time if same day
    this.validateReturnTime();
  }

  // Handle return date change
  onReturnDateChange(): void {
    // Clear results when changing dates
    this.showResults = false;
    this.hideValidationMessage();

    // Validate return time if same day
    this.validateReturnTime();
  }

  // Handle return time change
  onReturnTimeChange(): void {
    // Clear results when changing times
    this.showResults = false;
    this.hideValidationMessage();

    // Validate return time if same day
    this.validateReturnTime();
  }

  // Validate return time logic
  private validateReturnTime(): void {
    if (!this.isRoundTrip || !this.selectedDate || !this.selectedReturnDate) {
      return;
    }

    // If same day, ensure return time is after departure time (minimum 2 hours difference)
    if (this.selectedDate === this.selectedReturnDate) {
      if (this.selectedTime && this.selectedReturnTime) {
        const [depHour, depMin] = this.selectedTime
          .split(':')
          .map((num) => parseInt(num));
        const [retHour, retMin] = this.selectedReturnTime
          .split(':')
          .map((num) => parseInt(num));

        const depTimeInMinutes = depHour * 60 + depMin;
        const retTimeInMinutes = retHour * 60 + retMin;

        // Require at least 2 hours difference for same day return
        if (retTimeInMinutes <= depTimeInMinutes + 120) {
          // Auto-adjust return time to 2 hours after departure
          const newReturnTimeInMinutes = depTimeInMinutes + 120;
          const newReturnHour = Math.floor(newReturnTimeInMinutes / 60);
          const newReturnMin = newReturnTimeInMinutes % 60;

          // If it goes past midnight, set return date to next day and time to 10:00
          if (newReturnHour >= 24) {
            const returnDate = new Date(this.selectedReturnDate);
            returnDate.setDate(returnDate.getDate() + 1);
            this.selectedReturnDate = returnDate.toISOString().split('T')[0];
            this.selectedReturnTime = '10:00';
            this.showValidationMessage(
              'La fecha de regreso se ajustó al día siguiente debido a que el viaje debe durar mínimo 2 horas.'
            );
          } else {
            this.selectedReturnTime =
              String(newReturnHour).padStart(2, '0') +
              ':' +
              String(newReturnMin).padStart(2, '0');
            this.showValidationMessage(
              'La hora de regreso se ajustó automáticamente para mantener un mínimo de 2 horas entre salida y regreso.'
            );
          }
        }
      }
    }
  }

  // Show validation message
  private showValidationMessage(message: string): void {
    this.validationMessage = message;
    this.showValidationAlert = true;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.showValidationAlert = false;
    }, 5000);
  }

  // Hide validation message
  hideValidationMessage(): void {
    this.showValidationAlert = false;
  }

  // Validate if selected date/time is not in the past
  isDateTimeInPast(date: string, time: string): boolean {
    if (!date || !time) return false;

    const selectedDateTime = new Date(date + 'T' + time);
    const now = new Date();

    return selectedDateTime < now;
  }

  // Get minimum time for today's date
  getMinTimeForDate(date: string): string {
    if (!date) return '';

    const selectedDate = new Date(date);
    const today = new Date();

    // If selected date is today, minimum time is current time + 1 hour
    if (selectedDate.toDateString() === today.toDateString()) {
      const minTime = new Date(today.getTime() + 60 * 60 * 1000); // Add 1 hour
      return (
        String(minTime.getHours()).padStart(2, '0') +
        ':' +
        String(minTime.getMinutes()).padStart(2, '0')
      );
    }

    return '';
  }

  // Get minimum return time based on departure date and time
  getMinReturnTime(): string {
    if (!this.selectedDate || !this.selectedReturnDate || !this.selectedTime) {
      return '';
    }

    // If same day, minimum return time is departure time + 2 hours
    if (this.selectedDate === this.selectedReturnDate) {
      const [depHour, depMin] = this.selectedTime
        .split(':')
        .map((num) => parseInt(num));
      const minReturnTimeInMinutes = depHour * 60 + depMin + 120; // Add 2 hours

      if (minReturnTimeInMinutes < 24 * 60) {
        // Within same day
        const minReturnHour = Math.floor(minReturnTimeInMinutes / 60);
        const minReturnMin = minReturnTimeInMinutes % 60;

        return (
          String(minReturnHour).padStart(2, '0') +
          ':' +
          String(minReturnMin).padStart(2, '0')
        );
      }
    }

    return '';
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

  // Handle route selection from popular routes
  selectPopularRoute(routeId: string): void {
    const route = this.availableRoutes.find((r) => r.id === routeId);
    if (route) {
      this.selectedOrigin = route.origin;
      this.selectedDestination = route.destination;
      this.selectedRoute = route;
    }
  }

  // Handle form submission
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

    // Validate return time logic for same day trips
    if (this.isRoundTrip && this.selectedDate === this.selectedReturnDate) {
      const [depHour, depMin] = this.selectedTime
        .split(':')
        .map((num) => parseInt(num));
      const [retHour, retMin] = this.selectedReturnTime
        .split(':')
        .map((num) => parseInt(num));

      const depTimeInMinutes = depHour * 60 + depMin;
      const retTimeInMinutes = retHour * 60 + retMin;

      if (retTimeInMinutes <= depTimeInMinutes + 120) {
        this.showValidationMessage(
          'Para viajes del mismo día, la hora de regreso debe ser al menos 2 horas después de la salida'
        );
        return;
      }
    }

    // Find outbound route
    this.selectedRoute = this.findRoute(
      this.selectedOrigin,
      this.selectedDestination
    );

    if (!this.selectedRoute) {
      alert(
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
        alert('Lo sentimos, la ruta de regreso no está disponible.');
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

  // Get available origins for dropdown
  getAvailableOrigins(): string[] {
    return [...new Set(this.availableRoutes.map((r) => r.origin))];
  }

  // Get available destinations based on selected origin
  getAvailableDestinations(): string[] {
    if (!this.selectedOrigin) return [];
    return this.availableRoutes
      .filter((r) => r.origin === this.selectedOrigin)
      .map((r) => r.destination);
  }

  // Update destination when origin changes
  onOriginChange(): void {
    this.selectedDestination = '';
    this.selectedRoute = null;
    this.showResults = false;
  }

  // Update route when destination changes
  onDestinationChange(): void {
    if (this.selectedOrigin && this.selectedDestination) {
      this.selectedRoute = this.findRoute(
        this.selectedOrigin,
        this.selectedDestination
      );
    }
    this.showResults = false;
  }

  scrollToBooking(): void {
    const element = document.getElementById('van-transfers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
    console.log('Booking confirmed:', confirmation);
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

  // Method to pre-select destination from external components
  preSelectDestination(destination: string, passengers: number = 2): void {
    this.selectedDestination = destination;
    this.selectedPassengers = passengers;

    // Auto-select a common origin if destination is selected
    if (destination === 'París' && !this.selectedOrigin) {
      this.selectedOrigin = 'Ámsterdam';
    } else if (destination === 'Ámsterdam' && !this.selectedOrigin) {
      this.selectedOrigin = 'París';
    } else if (destination === 'Brujas' && !this.selectedOrigin) {
      this.selectedOrigin = 'París';
    }

    // Update selected route if both origin and destination are set
    this.updateSelectedRoute();

    // Scroll to the booking section
    setTimeout(() => {
      this.scrollToBooking();
    }, 100);
  }

  // Update the selected route based on origin and destination
  private updateSelectedRoute(): void {
    if (this.selectedOrigin && this.selectedDestination) {
      this.selectedRoute =
        this.availableRoutes.find(
          (route) =>
            route.origin === this.selectedOrigin &&
            route.destination === this.selectedDestination
        ) || null;
    }
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
