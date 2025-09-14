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
  serviceFee: number;
  urgencyFee?: number;
  grandTotal: number;
  isRoundTrip: boolean;
}

interface VanRecommendation {
  van: VanType;
  quantity: number;
  price: number;
}

interface PickupInfo {
  type: 'airport' | 'hotel' | '';
  airport?: string; // CDG or ORY
  flightNumber?: string;
  flightArrivalTime?: string;
  airline?: string;
  terminal?: string;
  hotelName?: string;
  address?: string;
}

interface ExpressTrip {
  type: 'airport-hotel-airport' | 'disney-transfer' | 'paris-tour-4h' | '';
  pickupLocation?: 'airport' | 'hotel' | '';
  returnPickupTime?: string;
  details?: string;
  isRoundTrip?: boolean; // for airport-hotel-airport service - whether return trip is needed
}

@Component({
  selector: 'app-van-transfer-hero',
  templateUrl: './van-transfer-hero.component.html',
  styleUrls: ['./van-transfer-hero.component.css'],
})
export class VanTransferHeroComponent implements OnInit {
  // Van Types with updated pricing structure
  vanTypes: VanType[] = [
    {
      id: 'van-standard',
      name: 'Van Premium (1-5 pasajeros)',
      capacity: 5,
      priceEur: 650,
      features: [
        'WiFi Gratis',
        'Aire Acondicionado',
        'Equipaje Incluido',
        'Conductor Profesional',
        'Accesible para silla de ruedas',
      ],
    },
    {
      id: 'van-large',
      name: 'Van Grande (6-9 pasajeros)',
      capacity: 9,
      priceEur: 900,
      features: [
        'WiFi Gratis',
        'Aire Acondicionado',
        'Equipaje Incluido',
        'Conductor Profesional',
        'Espacio Extra',
        'Accesible para silla de ruedas',
      ],
    },
    {
      id: 'van-tour',
      name: 'Van Tour París (1-4 pasajeros)',
      capacity: 4,
      priceEur: 350,
      features: [
        'Tour 4 horas',
        'Guía profesional',
        'WiFi Gratis',
        'Accesible para silla de ruedas',
      ],
    },
    {
      id: 'van-tour-5',
      name: 'Van Tour París (5-6 pasajeros)',
      capacity: 6,
      priceEur: 450,
      features: [
        'Tour 4 horas',
        'Guía profesional',
        'WiFi Gratis',
        'Accesible para silla de ruedas',
      ],
    },
    {
      id: 'van-tour-large',
      name: 'Van Tour París (7-9 pasajeros)',
      capacity: 9,
      priceEur: 800,
      features: [
        'Tour 4 horas',
        'Guía profesional',
        'WiFi Gratis',
        'Espacio Extra',
        'Accesible para silla de ruedas',
      ],
    },
  ];

  // Routes - All departing from Paris (as per requirements)
  availableRoutes: Route[] = [
    {
      id: 'paris-brujas',
      origin: 'París',
      destination: 'Brujas',
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
      id: 'paris-bruselas',
      origin: 'París',
      destination: 'Bruselas',
      duration: '3h 20min',
      distance: '265 km',
    },
  ];

  // Express trip options
  expressOptions = [
    {
      id: 'paris-tour-4h',
      name: 'Tour Express París (4 horas)',
      description:
        'Tour por París con recogida en aeropuerto (mínimo 5h de escala)',
    },
    {
      id: 'disney-transfer',
      name: 'Transporte a Disney',
      description: 'Transporte desde hotel/aeropuerto a Disneyland París',
    },
    {
      id: 'airport-hotel-airport',
      name: 'Aeropuerto - Hotel - Aeropuerto',
      description: 'Transporte completo aeropuerto-hotel-aeropuerto',
    },
  ];

  // Form Data
  selectedOrigin: string = 'París'; // Fixed to Paris as all trips depart from there
  selectedDestination: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedPassengers: number = 1;
  passengerCount: number = 1; // Alias for selectedPassengers for form binding
  selectedRoute: Route | null = null;
  requiresWheelchairAccess: boolean = false;

  // Round trip is same day except for Amsterdam
  isRoundTrip: boolean = true;
  selectedReturnDate: string = '';
  selectedReturnTime: string = '';
  returnRoute: Route | null = null;
  showReturnTimePicker: boolean = false;

  // Pickup and express trip information
  pickupInfo: PickupInfo = { type: '' };
  expressTrip: ExpressTrip = { type: '' };

  // Cached terminal options to prevent excessive method calls
  terminalOptions: { value: string; label: string }[] = [
    { value: '', label: 'Seleccione aeropuerto primero' },
  ];

  // Results and UI state
  bookingCalculation: BookingCalculation | null = null;
  showResults: boolean = false;
  validationMessage: string = '';
  showValidationAlert: boolean = false;
  showCheckoutModal: boolean = false;
  currentBookingDetails: any = null;

  // Calendar constraints
  minDate: Date = new Date();
  minDateString: string = '';

  benefits = [
    {
      icon: 'fas fa-wheelchair',
      title: 'Accesible',
      description: 'Todos los vehículos aceptan sillas de ruedas como equipaje',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Viaje Seguro',
      description:
        'Conductores certificados y vehículos inspeccionados regularmente',
    },
    {
      icon: 'fas fa-clock',
      title: 'Puntualidad',
      description: 'Llegamos siempre a tiempo',
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

  // Airport options
  airportOptions = [
    { value: 'CDG', label: 'Charles de Gaulle (CDG)' },
    { value: 'ORY', label: 'Orly (ORY)' },
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

    // Most trips are same day, return date equals departure date
    this.selectedReturnDate = this.selectedDate;

    // Set default time to 10:00
    this.selectedTime = '10:00';
    this.selectedReturnTime = '18:00'; // Default return 8 hours later
  }

  // Handle round trip toggle (always enabled now, so minimal functionality)
  onRoundTripToggle(): void {
    this.showResults = false;
  }

  // Handle departure date change for validation
  onDepartureDateChange(): void {
    this.showResults = false;
    this.hideValidationMessage();

    console.log('Date changed to:', this.selectedDate); // Debug log

    // Ensure return date is not before departure date
    if (
      this.selectedReturnDate &&
      this.selectedDate &&
      this.selectedReturnDate < this.selectedDate
    ) {
      const departureDate = new Date(this.selectedDate);
      departureDate.setDate(departureDate.getDate() + 1);
      this.selectedReturnDate = departureDate.toISOString().split('T')[0];
    }
    this.validateReturnTime();

    // Update booking details to trigger change detection
    this.updateBookingDetails();
  }

  // Update booking details when date changes
  private updateBookingDetails(): void {
    if (this.bookingCalculation) {
      this.currentBookingDetails = this.getBookingDetailsForCheckout();
      console.log(
        'Updated booking details due to date change:',
        this.currentBookingDetails
      );
    }
  }

  onDepartureTimeChange(): void {
    this.showResults = false;
    this.hideValidationMessage();
    this.validateReturnTime();
  }

  onReturnDateChange(): void {
    this.showResults = false;
    this.hideValidationMessage();
    this.validateReturnTime();
  }

  onReturnTimeChange(): void {
    this.showResults = false;
    this.hideValidationMessage();
    this.validateReturnTime();
  }

  private validateReturnTime(): void {
    if (!this.selectedDate || !this.selectedReturnDate) {
      return;
    }

    // If same day, ensure return time is at least 2 hours after departure
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

        if (retTimeInMinutes <= depTimeInMinutes + 120) {
          const newReturnTimeInMinutes = depTimeInMinutes + 120;
          const newReturnHour = Math.floor(newReturnTimeInMinutes / 60);
          const newReturnMin = newReturnTimeInMinutes % 60;

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

  private showValidationMessage(message: string): void {
    this.validationMessage = message;
    this.showValidationAlert = true;
    setTimeout(() => {
      this.showValidationAlert = false;
    }, 5000);
  }

  hideValidationMessage(): void {
    this.showValidationAlert = false;
  }

  // Get terminal options based on selected airport (DEPRECATED - use terminalOptions property instead)
  /*
  getTerminalOptions(): { value: string; label: string }[] {
    if (this.pickupInfo.airport === 'CDG') {
      return [
        { value: '', label: 'Seleccione Terminal' },
        { value: '1', label: 'Terminal 1' },
        { value: '2A', label: 'Terminal 2A' },
        { value: '2B', label: 'Terminal 2B' },
        { value: '2C', label: 'Terminal 2C' },
        { value: '2D', label: 'Terminal 2D' },
        { value: '2E', label: 'Terminal 2E' },
        { value: '2F', label: 'Terminal 2F' },
        { value: '2G', label: 'Terminal 2G' },
        { value: '3', label: 'Terminal 3' },
      ];
    } else if (this.pickupInfo.airport === 'ORY') {
      return [
        { value: '', label: 'Seleccione Terminal' },
        { value: '1', label: 'Terminal 1' },
        { value: '2', label: 'Terminal 2' },
        { value: '3', label: 'Terminal 3' },
        { value: '4', label: 'Terminal 4' },
      ];
    }
    return [{ value: '', label: 'Seleccione aeropuerto primero' }];
  }
  */

  // Handle airport change
  onAirportChange(): void {
    // Reset terminal when airport changes
    this.pickupInfo.terminal = '';

    // Update cached terminal options
    this.updateTerminalOptions();
  }

  // Update terminal options based on selected airport
  private updateTerminalOptions(): void {
    if (this.pickupInfo.airport === 'CDG') {
      this.terminalOptions = [
        { value: '', label: 'Seleccione Terminal' },
        { value: '1', label: 'Terminal 1' },
        { value: '2A', label: 'Terminal 2A' },
        { value: '2B', label: 'Terminal 2B' },
        { value: '2C', label: 'Terminal 2C' },
        { value: '2D', label: 'Terminal 2D' },
        { value: '2E', label: 'Terminal 2E' },
        { value: '2F', label: 'Terminal 2F' },
        { value: '2G', label: 'Terminal 2G' },
        { value: '3', label: 'Terminal 3' },
      ];
    } else if (this.pickupInfo.airport === 'ORY') {
      this.terminalOptions = [
        { value: '', label: 'Seleccione Terminal' },
        { value: '1', label: 'Terminal 1' },
        { value: '2', label: 'Terminal 2' },
        { value: '3', label: 'Terminal 3' },
        { value: '4', label: 'Terminal 4' },
      ];
    } else {
      this.terminalOptions = [
        { value: '', label: 'Seleccione aeropuerto primero' },
      ];
    }
  }

  isDateTimeInPast(date: string, time: string): boolean {
    if (!date || !time) return false;
    const selectedDateTime = new Date(date + 'T' + time);
    const now = new Date();
    return selectedDateTime < now;
  }

  getMinTimeForDate(date: string): string {
    if (!date) return '';
    const selectedDate = new Date(date);
    const today = new Date();

    // If selected date is today, minimum time is current time + 1 hour
    if (selectedDate.toDateString() === today.toDateString()) {
      const minTime = new Date(today.getTime() + 60 * 60 * 1000);
      return (
        String(minTime.getHours()).padStart(2, '0') +
        ':' +
        String(minTime.getMinutes()).padStart(2, '0')
      );
    }
    return '';
  }

  getMinReturnTime(): string {
    if (!this.selectedDate || !this.selectedReturnDate || !this.selectedTime) {
      return '';
    }

    // If same day, minimum return time is departure time + 2 hours
    if (this.selectedDate === this.selectedReturnDate) {
      const [depHour, depMin] = this.selectedTime
        .split(':')
        .map((num) => parseInt(num));
      const minReturnTimeInMinutes = depHour * 60 + depMin + 120;

      if (minReturnTimeInMinutes < 24 * 60) {
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

  // Calculate van pricing based on new requirements
  calculateVanRecommendation(passengers: number): BookingCalculation {
    if (passengers <= 0) {
      return {
        passengers: 0,
        vans: [],
        totalPrice: 0,
        serviceFee: 0,
        grandTotal: 0,
        isRoundTrip: true,
      };
    }

    let basePrice = 0;
    let van: VanType;

    // New pricing logic based on requirements
    if (this.expressTrip.type === 'paris-tour-4h') {
      // Paris tour pricing: $350 -> hasta 4 personas, $450 -> 5-6 personas, $800 -> 6-9 personas
      if (passengers <= 4) {
        basePrice = 350;
        van = this.vanTypes.find((v) => v.id === 'van-tour')!;
      } else if (passengers <= 6) {
        basePrice = 450;
        van = this.vanTypes.find((v) => v.id === 'van-tour-5')!;
      } else {
        basePrice = 800;
        van = this.vanTypes.find((v) => v.id === 'van-tour-large')!;
      }
    } else {
      // Regular transfer pricing: 1-5 passengers -> $650, 6-9 passengers -> $900
      if (passengers <= 5) {
        basePrice = 650;
        van = this.vanTypes.find((v) => v.id === 'van-standard')!;
      } else {
        basePrice = 900;
        van = this.vanTypes.find((v) => v.id === 'van-large')!;
      }

      // For Amsterdam, reduce price by 40% since it's one-way only
      if (this.selectedDestination === 'Ámsterdam') {
        basePrice = Math.round(basePrice * 0.6); // 40% reduction for one-way
      }
    }

    // Check for high urgency fee if trip is for tomorrow
    let urgencyFee = 0;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    if (this.selectedDate === tomorrowString) {
      urgencyFee = basePrice * 0.15; // 15% urgency fee for tomorrow trips
    }

    // For airport-hotel-airport round trip, double the price
    if (
      this.expressTrip.type === 'airport-hotel-airport' &&
      this.expressTrip.isRoundTrip
    ) {
      basePrice = basePrice * 2;
    }

    const totalPrice = basePrice + (urgencyFee || 0);
    const serviceFee = totalPrice * 0.07; // 7% service fee when payment
    const grandTotal = totalPrice + serviceFee;

    return {
      passengers,
      vans: [{ van, quantity: 1, price: basePrice }],
      totalPrice: basePrice,
      serviceFee,
      urgencyFee,
      grandTotal,
      isRoundTrip: this.selectedDestination !== 'Ámsterdam', // Amsterdam is one-way only
    };
  }

  findRoute(origin: string, destination: string): Route | null {
    return (
      this.availableRoutes.find(
        (route) =>
          route.origin.toLowerCase() === origin.toLowerCase() &&
          route.destination.toLowerCase() === destination.toLowerCase()
      ) || null
    );
  }

  selectPopularRoute(routeId: string): void {
    const route = this.availableRoutes.find((r) => r.id === routeId);
    if (route) {
      this.selectedOrigin = route.origin;
      this.selectedDestination = route.destination;
      this.selectedRoute = route;
    }
  }

  isSearchFormValid(): boolean {
    // Basic required fields
    if (!this.selectedDate || !this.selectedTime || this.passengerCount < 1) {
      return false;
    }

    // Express trip specific validation
    if (this.expressTrip.type) {
      switch (this.expressTrip.type) {
        case 'paris-tour-4h':
          return !!(
            this.pickupInfo.airport &&
            this.pickupInfo.flightNumber &&
            this.pickupInfo.airline &&
            this.pickupInfo.flightArrivalTime
          );
        case 'disney-transfer':
          if (this.expressTrip.pickupLocation === 'airport') {
            return !!(
              this.pickupInfo.airport &&
              this.pickupInfo.flightNumber &&
              this.pickupInfo.airline &&
              this.pickupInfo.flightArrivalTime
            );
          } else if (this.expressTrip.pickupLocation === 'hotel') {
            return !!(this.pickupInfo.hotelName && this.pickupInfo.address);
          }
          return false;
        case 'airport-hotel-airport':
          return !!(
            this.pickupInfo.airport &&
            this.pickupInfo.flightNumber &&
            this.pickupInfo.airline &&
            this.pickupInfo.flightArrivalTime &&
            this.pickupInfo.hotelName &&
            this.pickupInfo.address &&
            (!this.expressTrip.isRoundTrip ||
              (this.expressTrip.returnPickupTime && this.selectedReturnDate))
          );
        default:
          return true;
      }
    }

    // Regular transfer validation
    if (this.pickupInfo.type === 'airport') {
      return !!(
        this.selectedDestination &&
        this.pickupInfo.flightNumber &&
        this.pickupInfo.airline &&
        this.pickupInfo.flightArrivalTime
      );
    } else if (this.pickupInfo.type === 'hotel') {
      return !!(
        this.selectedDestination &&
        this.pickupInfo.hotelName &&
        this.pickupInfo.address
      );
    }

    return !!this.selectedDestination;
  }

  onSearchTransfers(): void {
    // Validate required fields
    if (!this.selectedDate || !this.selectedTime) {
      this.showValidationMessage(
        'Por favor complete todos los campos requeridos'
      );
      return;
    }

    // Validate service type selection
    if (!this.expressTrip.type && !this.selectedDestination) {
      this.showValidationMessage(
        'Por favor seleccione un destino o un servicio express'
      );
      return;
    }

    // Validate pickup information based on service type
    if (this.expressTrip.type === 'disney-transfer') {
      if (!this.expressTrip.pickupLocation) {
        this.showValidationMessage(
          'Por favor seleccione el lugar de recogida para Disney'
        );
        return;
      }

      if (this.expressTrip.pickupLocation === 'airport') {
        if (
          !this.pickupInfo.flightNumber ||
          !this.pickupInfo.flightArrivalTime ||
          !this.pickupInfo.airline
        ) {
          this.showValidationMessage(
            'Por favor complete toda la información del vuelo'
          );
          return;
        }
      } else if (this.expressTrip.pickupLocation === 'hotel') {
        if (!this.pickupInfo.hotelName || !this.pickupInfo.address) {
          this.showValidationMessage(
            'Por favor complete la información del hotel'
          );
          return;
        }
      }
    } else if (this.expressTrip.type === 'airport-hotel-airport') {
      if (
        !this.pickupInfo.flightNumber ||
        !this.pickupInfo.flightArrivalTime ||
        !this.pickupInfo.airline
      ) {
        this.showValidationMessage(
          'Por favor complete toda la información del vuelo'
        );
        return;
      }
      if (!this.pickupInfo.hotelName || !this.pickupInfo.address) {
        this.showValidationMessage(
          'Por favor complete la información del hotel'
        );
        return;
      }
      if (this.expressTrip.isRoundTrip && !this.expressTrip.returnPickupTime) {
        this.showValidationMessage(
          'Por favor seleccione la hora de recogida en el hotel'
        );
        return;
      }
      if (this.expressTrip.isRoundTrip && !this.selectedReturnDate) {
        this.showValidationMessage(
          'Por favor seleccione la fecha de regreso al aeropuerto'
        );
        return;
      }
    } else if (this.expressTrip.type === 'paris-tour-4h') {
      if (
        !this.pickupInfo.flightNumber ||
        !this.pickupInfo.flightArrivalTime ||
        !this.pickupInfo.airline
      ) {
        this.showValidationMessage(
          'Por favor complete toda la información del vuelo para el tour'
        );
        return;
      }
    } else {
      // Regular transfer validation
      if (!this.pickupInfo.type) {
        this.showValidationMessage('Por favor seleccione el tipo de recogida');
        return;
      }

      if (this.pickupInfo.type === 'airport') {
        if (
          !this.pickupInfo.flightNumber ||
          !this.pickupInfo.flightArrivalTime ||
          !this.pickupInfo.airline
        ) {
          this.showValidationMessage(
            'Por favor complete toda la información del vuelo'
          );
          return;
        }
      }

      if (this.pickupInfo.type === 'hotel') {
        if (!this.pickupInfo.hotelName || !this.pickupInfo.address) {
          this.showValidationMessage(
            'Por favor complete la información del hotel'
          );
          return;
        }
      }
    }

    // Validate dates are not in the past
    if (this.isDateTimeInPast(this.selectedDate, this.selectedTime)) {
      this.showValidationMessage(
        'La fecha y hora de salida no puede ser en el pasado'
      );
      return;
    }

    if (
      this.showReturnTimePicker &&
      this.isDateTimeInPast(this.selectedReturnDate, this.selectedReturnTime)
    ) {
      this.showValidationMessage(
        'La fecha y hora de regreso no puede ser en el pasado'
      );
      return;
    }

    // Find route if not express trip
    if (!this.expressTrip.type) {
      this.selectedRoute = this.findRoute(
        this.selectedOrigin,
        this.selectedDestination
      );
      if (!this.selectedRoute) {
        this.showValidationMessage('Ruta no disponible actualmente');
        return;
      }
    }

    // Calculate pricing
    this.bookingCalculation = this.calculateVanRecommendation(
      this.selectedPassengers
    );
    this.showResults = true;

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.querySelector('.booking-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  getAvailableOrigins(): string[] {
    return ['París']; // All trips depart from Paris
  }

  getAvailableDestinations(): string[] {
    if (this.expressTrip.type) {
      return []; // Express trips don't use regular destinations
    }
    return this.availableRoutes.map((r) => r.destination);
  }

  onOriginChange(): void {
    // Origin is fixed to Paris, so minimal functionality
    this.showResults = false;
  }

  onDestinationChange(): void {
    if (this.selectedOrigin && this.selectedDestination) {
      this.selectedRoute = this.findRoute(
        this.selectedOrigin,
        this.selectedDestination
      );

      // For Amsterdam, no return trip is included
      if (this.selectedDestination === 'Ámsterdam') {
        this.isRoundTrip = false;
        this.showReturnTimePicker = false;
        this.selectedReturnDate = '';
        this.selectedReturnTime = '';
      } else {
        // For other destinations (Brujas, Bruselas), round trip is included
        this.isRoundTrip = true;
        this.showReturnTimePicker = false;
        this.selectedReturnDate = this.selectedDate;
        // Calculate return time based on departure + trip duration + time at destination
        const [depHour, depMin] = this.selectedTime
          .split(':')
          .map((num) => parseInt(num));
        const returnHour = Math.min(23, depHour + 8); // 8 hours later, max 23:00
        this.selectedReturnTime = String(returnHour).padStart(2, '0') + ':00';
      }
    }
    this.showResults = false;
  }

  onPickupTypeChange(): void {
    this.showResults = false;
    // Reset pickup info when type changes
    if (this.pickupInfo.type === 'airport') {
      this.pickupInfo = {
        type: 'airport',
        flightNumber: '',
        flightArrivalTime: '',
        airline: '',
        terminal: '',
      };
    } else if (this.pickupInfo.type === 'hotel') {
      this.pickupInfo = {
        type: 'hotel',
        hotelName: '',
        address: '',
      };
    }
  }

  onPassengerCountChange(): void {
    // Sync the selectedPassengers with passengerCount
    this.selectedPassengers = this.passengerCount;
    this.showResults = false;
  }

  onExpressTripChange(): void {
    this.showResults = false;

    // Reset destination and route when express trip is selected
    if (this.expressTrip.type) {
      this.selectedDestination = '';
      this.selectedRoute = null;
      this.showReturnTimePicker = false;

      // For airport-hotel-airport, show return time picker
      if (this.expressTrip.type === 'airport-hotel-airport') {
        this.showReturnTimePicker = true;
        this.selectedReturnDate = this.selectedDate;
      }

      // Reset pickup location for disney transfer
      if (this.expressTrip.type === 'disney-transfer') {
        this.expressTrip.pickupLocation = '';
        this.selectedReturnDate = this.selectedDate;
      }

      // Paris tour is same day
      if (this.expressTrip.type === 'paris-tour-4h') {
        this.selectedReturnDate = this.selectedDate;
        const [depHour, depMin] = this.selectedTime
          .split(':')
          .map((num) => parseInt(num));
        const returnHour = Math.min(23, depHour + 4); // 4 hours later
        this.selectedReturnTime = String(returnHour).padStart(2, '0') + ':00';
      }
    } else {
      this.showReturnTimePicker = false;
    }
  }

  onDisneyPickupLocationChange(): void {
    this.showResults = false;
    // Reset pickup info when disney pickup location changes
    if (this.expressTrip.pickupLocation === 'airport') {
      this.pickupInfo = {
        type: 'airport',
        flightNumber: '',
        flightArrivalTime: '',
        airline: '',
        terminal: '',
      };
    } else if (this.expressTrip.pickupLocation === 'hotel') {
      this.pickupInfo = {
        type: 'hotel',
        hotelName: '',
        address: '',
      };
    }
  }

  scrollToBooking(): void {
    const element = document.getElementById('van-transfers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openCheckoutModal(): void {
    // Refresh booking details before opening modal
    this.currentBookingDetails = this.getBookingDetailsForCheckout();
    console.log(
      'Opening checkout modal with booking details:',
      this.currentBookingDetails
    );

    this.showCheckoutModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
    document.body.style.overflow = 'auto';
  }

  onBookingConfirmed(confirmation: any): void {
    console.log('Booking confirmed:', confirmation);
    // Here you would typically:
    // 1. Send confirmation to backend
    // 2. Send confirmation email
    // 3. Update user's booking history
    // 4. Show success message

    setTimeout(() => {
      this.closeCheckoutModal();
      this.showResults = false;
      this.resetForm();
    }, 3000);
  }

  private resetForm(): void {
    this.selectedDestination = '';
    this.selectedPassengers = 1;
    this.bookingCalculation = null;
    this.pickupInfo = { type: '' };
    this.expressTrip = { type: '' };

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
    this.updateSelectedRoute();
    setTimeout(() => {
      this.scrollToBooking();
    }, 100);
  }

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
    if (!this.bookingCalculation) {
      return null;
    }

    console.log(
      'Creating booking details with selectedDate:',
      this.selectedDate
    ); // Debug log

    const bookingDetails = {
      bookingId: 'VT' + Date.now().toString(36).toUpperCase(),
      origin: this.selectedOrigin,
      destination: this.selectedDestination,
      departureDate: this.selectedDate,
      departureTime: this.selectedTime,
      returnDate: this.selectedReturnDate,
      returnTime: this.selectedReturnTime,
      passengers: this.selectedPassengers,
      vans: this.bookingCalculation.vans,
      totalPrice: this.bookingCalculation.totalPrice,
      serviceFee: this.bookingCalculation.serviceFee,
      urgencyFee: this.bookingCalculation.urgencyFee,
      grandTotal: this.bookingCalculation.grandTotal,
      isRoundTrip: this.isRoundTrip,
      duration: this.selectedRoute?.duration || 'Varies',
      distance: this.selectedRoute?.distance || 'Varies',
      pickupInfo: this.pickupInfo,
      expressTrip: this.expressTrip,
    };

    console.log('Booking details created:', bookingDetails); // Debug log
    return bookingDetails;
  }
}
