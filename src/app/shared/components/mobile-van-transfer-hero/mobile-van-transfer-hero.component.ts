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
  faCog,
  faRocket,
  faWheelchair,
  faInfoCircle,
  faPlane,
  faHotel,
  faExchangeAlt,
  faPlus,
  faMinus,
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
  type: string; // 'paris-tour-4h', 'disney-transfer', 'airport-hotel-airport'
  pickupLocation?: string; // 'airport' or 'hotel' (for Disney)
  returnPickupTime?: string; // for airport-hotel-airport service
  isRoundTrip?: boolean; // for airport-hotel-airport service - whether return trip is needed
}

interface BookingCalculation {
  passengers: number;
  vans: VanRecommendation[];
  totalPrice: number;
  serviceFee: number;
  urgencyFee?: number;
  grandTotal: number;
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
  faCog = faCog;
  faRocket = faRocket;
  faWheelchair = faWheelchair;
  faInfoCircle = faInfoCircle;
  faPlane = faPlane;
  faHotel = faHotel;
  faExchangeAlt = faExchangeAlt;
  faPlus = faPlus;
  faMinus = faMinus;

  // Van Types
  vans: VanType[] = [
    {
      id: 'small',
      name: 'Van Pequeña',
      capacity: 5,
      priceEur: 650,
      features: [
        'Hasta 5 pasajeros',
        'Aire acondicionado',
        'WiFi gratuito',
        'Conductor profesional',
      ],
    },
    {
      id: 'large',
      name: 'Van Grande',
      capacity: 9,
      priceEur: 900,
      features: [
        'Hasta 9 pasajeros',
        'Aire acondicionado',
        'WiFi gratuito',
        'Conductor profesional',
        'Espacio extra para equipaje',
      ],
    },
  ];

  // Routes
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
  selectedDestination: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedReturnDate: string = '';
  selectedPassengers: number = 1;
  selectedRoute: Route | null = null;

  // Express trip data
  expressTrip: ExpressTrip = { type: 'none' };

  // Pickup information for regular transfers
  pickupInfo: PickupInfo = { type: '' };

  // Pickup details for Disney transfer
  airportPickup = {
    airport: '', // CDG or ORY
    flightNumber: '',
    airline: '',
    terminal: '',
    arrivalTime: '',
  };

  hotelPickup = {
    name: '',
    address: '',
  };

  // Destination options
  destinationOptions = [
    { value: 'Brujas', label: 'Brujas' },
    { value: 'Bruselas', label: 'Bruselas' },
    { value: 'Ámsterdam', label: 'Ámsterdam (Solo Ida)' },
  ];

  // Express trip options
  expressTripOptions = [
    {
      value: 'none',
      label: 'Transporte regular',
      description: 'Ida y vuelta desde París',
    },
    {
      value: 'paris-tour-4h',
      label: 'Tour París Express 4h',
      description:
        'Tour guiado por París (€350-800 según pasajeros, mín. 5h escala)',
    },
    {
      value: 'disney-transfer',
      label: 'Traslado Disney',
      description: 'Solo traslado a Disney',
    },
    {
      value: 'airport-hotel-airport',
      label: 'Aeropuerto-Hotel-Aeropuerto',
      description: 'Servicio completo ida y vuelta aeropuerto',
    },
  ];

  // Results
  bookingCalculation: BookingCalculation | null = null;
  showResults: boolean = false;

  // Validation
  validationMessage: string = '';
  showValidationAlert: boolean = false;

  // Checkout modal
  showCheckoutModal: boolean = false;

  // Calendar constraints
  minDateString: string = '';

  // Available times
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

  // Airport options
  airportOptions = [
    { value: 'CDG', label: 'Charles de Gaulle (CDG)' },
    { value: 'ORY', label: 'Orly (ORY)' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.disableZoom();
    this.preventHorizontalScroll();

    // Set minimum date to today
    const today = new Date();
    this.minDateString = today.toISOString().split('T')[0];

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate = tomorrow.toISOString().split('T')[0];

    // Set default return date (day after departure)
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    this.selectedReturnDate = dayAfterTomorrow.toISOString().split('T')[0];

    // Set default time
    this.selectedTime = '10:00';
  }

  ngOnDestroy(): void {
    this.enableZoom();
    this.cleanupHorizontalScrollPrevention();
  }

  private disableZoom(): void {
    let viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    if (!viewport.getAttribute('data-original-content')) {
      viewport.setAttribute('data-original-content', viewport.content || '');
    }

    viewport.content =
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.body.style.touchAction = 'manipulation';
  }

  private enableZoom(): void {
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
    document.body.style.touchAction = 'auto';
  }

  private preventHorizontalScroll(): void {
    // Apply overflow-x: hidden to prevent horizontal scrolling
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100%';
      document.body.style.maxWidth = '100%';

      // Prevent touch scrolling horizontally
      document.body.style.touchAction = 'pan-y pinch-zoom';

      // Force all elements to respect viewport width
      const style = document.createElement('style');
      style.id = 'mobile-overflow-prevention';
      style.textContent = `
        * {
          max-width: 100vw !important;
          box-sizing: border-box !important;
        }
        
        body, html {
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .container, .container-fluid, .row {
          overflow-x: hidden !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        
        [class*="col-"] {
          overflow-x: hidden !important;
          word-wrap: break-word !important;
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }

        .btn-group {
          width: 100% !important;
          flex-wrap: wrap !important;
        }

        .form-control, .form-select, .btn {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .card, .mobile-booking-card {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
      `;

      // Remove existing style if it exists
      const existingStyle = document.getElementById(
        'mobile-overflow-prevention'
      );
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);
    }
  }

  private cleanupHorizontalScrollPrevention(): void {
    // Remove the overflow prevention styles
    const existingStyle = document.getElementById('mobile-overflow-prevention');
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  calculateVanRecommendation(passengers: number): BookingCalculation {
    if (passengers <= 0) {
      return {
        passengers: 0,
        vans: [],
        totalPrice: 0,
        serviceFee: 0,
        grandTotal: 0,
      };
    }

    let basePrice = 0;
    let bestRecommendation: VanRecommendation[] = [];

    // Handle Paris Tour Express 4h pricing
    if (this.expressTrip.type === 'paris-tour-4h') {
      if (passengers <= 4) {
        basePrice = 350;
        bestRecommendation = [
          {
            van: {
              id: 'tour-small',
              name: 'Tour París (hasta 4)',
              capacity: 4,
              priceEur: 350,
              features: ['Hasta 4 personas', 'Tour 4 horas', 'Guía incluido'],
            },
            quantity: 1,
            price: 350,
          },
        ];
      } else if (passengers <= 6) {
        basePrice = 450;
        bestRecommendation = [
          {
            van: {
              id: 'tour-medium',
              name: 'Tour París (5-6)',
              capacity: 6,
              priceEur: 450,
              features: ['5-6 personas', 'Tour 4 horas', 'Guía incluido'],
            },
            quantity: 1,
            price: 450,
          },
        ];
      } else if (passengers <= 9) {
        basePrice = 800;
        bestRecommendation = [
          {
            van: {
              id: 'tour-large',
              name: 'Tour París (6-9)',
              capacity: 9,
              priceEur: 800,
              features: ['6-9 personas', 'Tour 4 horas', 'Guía incluido'],
            },
            quantity: 1,
            price: 800,
          },
        ];
      } else {
        // For more than 9 passengers in tour, use multiple large vans
        const largeVansNeeded = Math.ceil(passengers / 9);
        basePrice = largeVansNeeded * 800;
        bestRecommendation = [
          {
            van: {
              id: 'tour-large',
              name: 'Tour París (6-9)',
              capacity: 9,
              priceEur: 800,
              features: ['6-9 personas', 'Tour 4 horas', 'Guía incluido'],
            },
            quantity: largeVansNeeded,
            price: basePrice,
          },
        ];
      }
    } else {
      // Regular transfer pricing: €650 for 1-5 passengers, €900 for 6-9 passengers
      const smallVan = this.vans.find((v) => v.capacity === 5)!;
      const largeVan = this.vans.find((v) => v.capacity === 9)!;

      if (passengers <= 5) {
        bestRecommendation = [
          {
            van: smallVan,
            quantity: 1,
            price: smallVan.priceEur,
          },
        ];
        basePrice = smallVan.priceEur;
      } else if (passengers <= 9) {
        bestRecommendation = [
          {
            van: largeVan,
            quantity: 1,
            price: largeVan.priceEur,
          },
        ];
        basePrice = largeVan.priceEur;
      } else {
        // For more than 9 passengers, use multiple vans
        const largeVansNeeded = Math.floor(passengers / 9);
        const remainingPassengers = passengers % 9;

        bestRecommendation = [
          {
            van: largeVan,
            quantity: largeVansNeeded,
            price: largeVansNeeded * largeVan.priceEur,
          },
        ];
        basePrice = largeVansNeeded * largeVan.priceEur;

        if (remainingPassengers > 0) {
          if (remainingPassengers <= 5) {
            bestRecommendation.push({
              van: smallVan,
              quantity: 1,
              price: smallVan.priceEur,
            });
            basePrice += smallVan.priceEur;
          } else {
            bestRecommendation.push({
              van: largeVan,
              quantity: 1,
              price: largeVan.priceEur,
            });
            basePrice += largeVan.priceEur;
          }
        }
      }
    }

    // For airport-hotel-airport round trip, double the price
    if (
      this.expressTrip.type === 'airport-hotel-airport' &&
      this.expressTrip.isRoundTrip
    ) {
      basePrice = basePrice * 2;
      // Update recommendation prices for round trip
      bestRecommendation = bestRecommendation.map((rec) => ({
        ...rec,
        price: rec.price * 2,
      }));
    }

    let totalPrice = basePrice;
    const serviceFee = Math.round(totalPrice * 0.07);

    // Calculate urgency fee (10% if traveling tomorrow)
    let urgencyFee = 0;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const selectedDateObj = new Date(this.selectedDate);
    if (selectedDateObj.toDateString() === tomorrow.toDateString()) {
      urgencyFee = Math.round(totalPrice * 0.1);
    }

    const grandTotal = totalPrice + serviceFee + urgencyFee;

    return {
      passengers,
      vans: bestRecommendation,
      totalPrice: totalPrice,
      serviceFee,
      urgencyFee,
      grandTotal,
    };
  }

  onExpressTripChange(value: string): void {
    this.expressTrip.type = value;

    // Reset specific properties when changing trip type
    if (value !== 'disney-transfer') {
      this.expressTrip.pickupLocation = undefined;
      // Reset pickup details
      this.airportPickup = {
        airport: '',
        flightNumber: '',
        airline: '',
        terminal: '',
        arrivalTime: '',
      };
      this.hotelPickup = {
        name: '',
        address: '',
      };
    }
    if (value !== 'airport-hotel-airport' && value !== 'paris-tour-4h') {
      this.expressTrip.returnPickupTime = undefined;
      // Reset pickup details for airport-hotel-airport
      if (value !== 'disney-transfer') {
        this.airportPickup = {
          airport: '',
          flightNumber: '',
          airline: '',
          terminal: '',
          arrivalTime: '',
        };
        this.hotelPickup = {
          name: '',
          address: '',
        };
      }
    }

    // Reset destination when changing express trip type
    this.selectedDestination = '';
    this.selectedRoute = null;

    // Clear results
    this.showResults = false;
    this.bookingCalculation = null;
  }
  onDestinationChange(destination: string): void {
    this.selectedDestination = destination;
    this.selectedRoute = this.findRoute('París', destination);
    this.showResults = false;
    this.bookingCalculation = null;
  }

  onPickupTypeChange(type: string): void {
    this.showResults = false;
    // Reset pickup info when type changes
    if (type === 'airport') {
      this.pickupInfo = {
        type: 'airport',
        flightNumber: '',
        flightArrivalTime: '',
        airline: '',
        terminal: '',
      };
    } else if (type === 'hotel') {
      this.pickupInfo = {
        type: 'hotel',
        hotelName: '',
        address: '',
      };
    }
  }

  isSearchFormValid(): boolean {
    // Basic validation
    if (
      !this.selectedDate ||
      !this.selectedTime ||
      this.selectedPassengers < 1
    ) {
      return false;
    }

    // For regular transfers, need destination and pickup information
    if (this.expressTrip.type === 'none') {
      if (!this.selectedDestination) {
        return false;
      }

      // Need pickup type
      if (!this.pickupInfo.type) {
        return false;
      }

      // For airport pickup, need flight details
      if (this.pickupInfo.type === 'airport') {
        if (
          !this.pickupInfo.airport ||
          !this.pickupInfo.flightNumber ||
          !this.pickupInfo.airline ||
          !this.pickupInfo.flightArrivalTime
        ) {
          return false;
        }
      }

      // For hotel pickup, need hotel details
      if (this.pickupInfo.type === 'hotel') {
        if (!this.pickupInfo.hotelName || !this.pickupInfo.address) {
          return false;
        }
      }
    }

    // For Disney transfer, need pickup location and details
    if (this.expressTrip.type === 'disney-transfer') {
      if (!this.expressTrip.pickupLocation) {
        return false;
      }
      // For airport pickup, need flight details
      if (this.expressTrip.pickupLocation === 'airport') {
        if (
          !this.airportPickup.airport ||
          !this.airportPickup.flightNumber ||
          !this.airportPickup.airline ||
          !this.airportPickup.terminal ||
          !this.airportPickup.arrivalTime
        ) {
          return false;
        }
      }
      // For hotel pickup, need hotel details
      if (this.expressTrip.pickupLocation === 'hotel') {
        if (!this.hotelPickup.name || !this.hotelPickup.address) {
          return false;
        }
      }
    }

    // For airport-hotel-airport, need flight details, hotel details, and return pickup time (only for round trips)
    if (this.expressTrip.type === 'airport-hotel-airport') {
      if (
        !this.airportPickup.airport ||
        !this.airportPickup.flightNumber ||
        !this.airportPickup.airline ||
        !this.airportPickup.arrivalTime ||
        !this.hotelPickup.name ||
        !this.hotelPickup.address ||
        (this.expressTrip.isRoundTrip &&
          (!this.expressTrip.returnPickupTime || !this.selectedReturnDate))
      ) {
        return false;
      }
    }

    return true;
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

  getAvailableDestinations(): string[] {
    return this.availableRoutes
      .filter((r) => r.origin === 'París')
      .map((r) => r.destination);
  }

  onSearchTransfers(): void {
    if (!this.isSearchFormValid()) {
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

    // For regular transfers, find route from Paris to destination
    if (this.expressTrip.type === 'none') {
      this.selectedRoute = this.findRoute('París', this.selectedDestination);
      if (!this.selectedRoute) {
        this.showValidationMessage(
          'Lo sentimos, esta ruta no está disponible actualmente.'
        );
        return;
      }
    } else {
      // For express trips, create a mock route
      this.selectedRoute = {
        id: 'express-' + this.expressTrip.type,
        origin: 'París',
        destination: this.getExpressDestination(),
        duration: this.getExpressDuration(),
        distance: this.getExpressDistance(),
      };
    }

    // Calculate van recommendation
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

  // Helper methods for express trips
  getExpressDestination(): string {
    switch (this.expressTrip.type) {
      case 'paris-tour-4h':
        return 'Tour París (4 horas)';
      case 'disney-transfer':
        return 'Disneyland París';
      case 'airport-hotel-airport':
        return 'Hotel (ida y vuelta)';
      default:
        return 'Destino Express';
    }
  }

  getExpressDuration(): string {
    switch (this.expressTrip.type) {
      case 'paris-tour-4h':
        return '4 horas';
      case 'disney-transfer':
        return '1h 30min';
      case 'airport-hotel-airport':
        return 'Día completo';
      default:
        return 'Variable';
    }
  }

  getExpressDistance(): string {
    switch (this.expressTrip.type) {
      case 'paris-tour-4h':
        return 'Ciudad de París';
      case 'disney-transfer':
        return '45 km';
      case 'airport-hotel-airport':
        return 'Variable';
      default:
        return 'Variable';
    }
  }

  getSelectedExpressTripDescription(): string {
    const trip = this.expressTripOptions.find(
      (t) => t.value === this.expressTrip.type
    );
    return trip ? trip.description : '';
  }

  isDateTimeInPast(date: string, time: string): boolean {
    if (!date || !time) return false;
    const selectedDateTime = new Date(date + 'T' + time);
    const now = new Date();
    return selectedDateTime < now;
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
    this.validationMessage = '';
  }

  incrementPassengers(): void {
    if (this.selectedPassengers < 15) {
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

  // Get terminal options based on selected airport
  getTerminalOptions(): { value: string; label: string }[] {
    const selectedAirport =
      this.airportPickup.airport || this.pickupInfo.airport;

    if (selectedAirport === 'CDG') {
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
    } else if (selectedAirport === 'ORY') {
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

  // Handle airport change
  onAirportChange(): void {
    // Reset terminal when airport changes
    this.airportPickup.terminal = '';
    this.pickupInfo.terminal = '';
  }

  // Handle departure date change for validation
  onDepartureDateChange(): void {
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
  }

  onReturnDateChange(): void {
    // Ensure return date is not before departure date
    if (
      this.selectedReturnDate &&
      this.selectedDate &&
      this.selectedReturnDate < this.selectedDate
    ) {
      this.selectedReturnDate = this.selectedDate;
    }
  }

  // Checkout modal methods
  openCheckoutModal(): void {
    this.showCheckoutModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
    document.body.style.overflow = 'auto';
  }

  onBookingConfirmed(confirmation: any): void {
    console.log('Mobile booking confirmed:', confirmation);
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
    this.expressTrip = { type: 'none' };

    // Reset pickup details
    this.airportPickup = {
      airport: '',
      flightNumber: '',
      airline: '',
      terminal: '',
      arrivalTime: '',
    };
    this.hotelPickup = {
      name: '',
      address: '',
    };

    // Reset date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate = tomorrow.toISOString().split('T')[0];
    this.selectedTime = '10:00';
  }

  getBookingDetailsForCheckout(): any {
    if (!this.bookingCalculation || !this.selectedRoute) {
      return null;
    }

    // Prepare airport information if available
    let airportInfo = null;
    if (this.expressTrip.type === 'paris-tour-4h' && this.airportPickup) {
      const airportOption = this.airportOptions.find(
        (airport) => airport.value === this.airportPickup.airport
      );
      airportInfo = {
        airport: this.airportPickup.airport,
        airportLabel: airportOption
          ? airportOption.label
          : this.airportPickup.airport,
        flightNumber: this.airportPickup.flightNumber,
        airline: this.airportPickup.airline,
        terminal: this.airportPickup.terminal,
        arrivalTime: this.airportPickup.arrivalTime,
      };
    }

    return {
      bookingId: 'VT' + Date.now().toString(36).toUpperCase(),
      origin: 'París',
      destination: this.selectedDestination,
      departureDate: this.selectedDate,
      departureTime: this.selectedTime,
      returnDate: this.selectedReturnDate,
      returnTime: this.expressTrip.returnPickupTime,
      passengers: this.selectedPassengers,
      serviceType: this.expressTrip.type === 'none' ? 'regular' : 'express',
      expressTrip: this.expressTrip,
      airportInfo: airportInfo,
      vans: this.bookingCalculation.vans,
      totalPrice: this.bookingCalculation.totalPrice,
      serviceFee: this.bookingCalculation.serviceFee,
      urgencyFee: this.bookingCalculation.urgencyFee,
      grandTotal: this.bookingCalculation.grandTotal,
      duration: this.selectedRoute.duration,
      distance: this.selectedRoute.distance,
    };
  }
}
