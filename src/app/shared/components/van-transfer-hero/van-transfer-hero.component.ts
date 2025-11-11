import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  faVanShuttle,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faUsers,
  faSearch,
  faWheelchair,
  faPlane,
  faHotel,
  faExchangeAlt,
  faPlus,
  faMinus,
  faExclamationTriangle,
  faHome,
  faCamera,
  faCheck,
  faSpinner,
  faShieldAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  AirportTerminal,
  PickupType,
  PriceCalculation,
} from '../../models/van-transfer.models';
import * as VanTransferActions from '../../store/actions/van-transfer.actions';
import * as VanTransferSelectors from '../../store/selectors/van-transfer.selectors';
import { encodeBookingData, BookingData } from '../../utils/booking-data.util';

@Component({
  selector: 'app-van-transfer-hero',
  templateUrl: './van-transfer-hero.component.html',
  styleUrls: ['./van-transfer-hero.component.css'],
})
export class VanTransferHeroComponent implements OnInit, OnDestroy {
  faVanShuttle = faVanShuttle;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarAlt = faCalendarAlt;
  faClock = faClock;
  faUsers = faUsers;
  faSearch = faSearch;
  faWheelchair = faWheelchair;
  faPlane = faPlane;
  faHotel = faHotel;
  faExchangeAlt = faExchangeAlt;
  faPlus = faPlus;
  faMinus = faMinus;
  faExclamationTriangle = faExclamationTriangle;
  faHome = faHome;
  faCamera = faCamera;
  faCheck = faCheck;
  faSpinner = faSpinner;
  faShieldAlt = faShieldAlt;
  faStar = faStar;

  transferTypes: TransferType[] = [];
  destinations: Destination[] = [];
  pricingTiers: PricingTier[] = [];
  airports: Airport[] = [];
  airportTerminals: AirportTerminal[] = [];
  pickupTypes: PickupType[] = [];
  loading = false;

  selectedTransferType: string = '';
  selectedDestinationId: number | null = null;
  passengerCount: number = 2;
  requiresWheelchairAccess: boolean = false;
  isRoundTrip: boolean = false;

  pickupType: 'hotel' | 'airport' | 'airbnb' | '' = '';
  pickupName: string = '';
  pickupAddress: string = '';
  selectedAirportId: number | null = null;
  selectedTerminalId: number | null = null;
  flightNumber: string = '';

  serviceDate: string = '';
  serviceTime: string = '10:00';
  returnDate: string = '';
  returnTime: string = '18:00';

  showResults: boolean = false;
  priceCalculation: PriceCalculation | null = null;
  validationErrors: string[] = [];
  showValidationAlert: boolean = false;

  isMobile: boolean = false;
  minDate: string = '';

  // Accordion Wizard Steps
  currentStep: number = 1;
  completedSteps: Set<number> = new Set();

  private subscriptions: Subscription = new Subscription();

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.serviceDate = tomorrow.toISOString().split('T')[0];

    this.loadVanTransferData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadVanTransferData(): void {
    // Dispatch action to load data
    this.store.dispatch(VanTransferActions.loadVanTransferData());

    // Subscribe to store selectors
    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectTransferTypes).subscribe({
        next: (types) => {
          this.transferTypes = types;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectDestinations).subscribe({
        next: (destinations) => {
          this.destinations = destinations;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectPricingTiers).subscribe({
        next: (tiers) => {
          this.pricingTiers = tiers;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectAirports).subscribe({
        next: (airports) => {
          this.airports = airports;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectAirportTerminals).subscribe({
        next: (terminals) => {
          this.airportTerminals = terminals;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectPickupTypes).subscribe({
        next: (pickupTypes) => {
          this.pickupTypes = pickupTypes;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectLoading).subscribe({
        next: (loading) => {
          this.loading = loading;
        },
      })
    );

    this.subscriptions.add(
      this.store.select(VanTransferSelectors.selectError).subscribe({
        next: (error) => {
          if (error) {
            console.error('❌ Error loading van transfer data:', error);
          }
        },
      })
    );
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth <= 991.98;
  }

  onTransferTypeChange(): void {
    this.showResults = false;
    this.validationErrors = [];
    this.selectedDestinationId = null;

    const transferType = this.transferTypes.find(
      (t) => t.typeKey === this.selectedTransferType
    );
    if (transferType) {
      this.isRoundTrip = false;
    }

    // Auto-advance to next step
    setTimeout(() => {
      this.nextStep();
    }, 400);
  }

  getAvailableDestinations(): Destination[] {
    if (this.selectedTransferType === 'one-day-tour') {
      return this.destinations;
    }
    return [];
  }

  needsDestination(): boolean {
    return this.selectedTransferType === 'one-day-tour';
  }

  showRoundTripOption(): boolean {
    const transferType = this.transferTypes.find(
      (t) => t.typeKey === this.selectedTransferType
    );
    return transferType?.isRoundTripOption || false;
  }

  incrementPassengers(): void {
    if (this.passengerCount < 12) {
      this.passengerCount++;
      this.showResults = false;
    }
  }

  decrementPassengers(): void {
    if (this.passengerCount > 1) {
      this.passengerCount--;
      this.showResults = false;
    }
  }

  onAirportChange(): void {
    this.selectedTerminalId = null;
    this.showResults = false;
  }

  onDestinationChange(): void {
    this.showResults = false;
    // Auto-advance to next step
    setTimeout(() => {
      this.nextStep();
    }, 400);
  }

  onPickupTypeChange(): void {
    this.showResults = false;
    // Clear previous pickup details
    this.pickupName = '';
    this.pickupAddress = '';
    this.selectedAirportId = null;
    this.selectedTerminalId = null;
    this.flightNumber = '';

    // Auto-advance to next step
    setTimeout(() => {
      this.nextStep();
    }, 400);
  }

  onRoundTripChange(): void {
    this.showResults = false;
    // Auto-advance to next step after a brief delay
    setTimeout(() => {
      this.nextStep();
    }, 400);
  }

  checkAndAdvancePickupDetails(): void {
    if (this.isPickupDetailsComplete()) {
      setTimeout(() => {
        this.nextStep();
      }, 300);
    }
  }

  checkAndAdvanceServiceDateTime(): void {
    if (this.serviceDate && this.serviceTime) {
      setTimeout(() => {
        if (this.isRoundTrip) {
          this.nextStep();
        }
      }, 300);
    }
  }

  getTerminalsForAirport(): AirportTerminal[] {
    if (!this.selectedAirportId) {
      return [];
    }
    return this.airportTerminals.filter(
      (t) => t.airportId === this.selectedAirportId
    );
  }

  private validateForm(): boolean {
    this.validationErrors = [];

    if (!this.selectedTransferType) {
      this.validationErrors.push('Por favor seleccione un tipo de servicio');
    }

    if (this.needsDestination() && !this.selectedDestinationId) {
      this.validationErrors.push('Por favor seleccione un destino');
    }

    if (this.passengerCount < 1 || this.passengerCount > 12) {
      this.validationErrors.push(
        'El número de pasajeros debe estar entre 1 y 12'
      );
    }

    if (!this.pickupType) {
      this.validationErrors.push('Por favor seleccione el tipo de recogida');
    }

    if (this.pickupType === 'airport') {
      if (!this.selectedAirportId) {
        this.validationErrors.push('Por favor seleccione un aeropuerto');
      }
      if (!this.selectedTerminalId) {
        this.validationErrors.push('Por favor seleccione una terminal');
      }
      if (!this.flightNumber || this.flightNumber.trim() === '') {
        this.validationErrors.push('Por favor ingrese el número de vuelo');
      }
    } else if (this.pickupType === 'hotel' || this.pickupType === 'airbnb') {
      if (!this.pickupName || this.pickupName.trim() === '') {
        this.validationErrors.push(
          'Por favor ingrese el nombre del ' +
            (this.pickupType === 'hotel' ? 'hotel' : 'Airbnb')
        );
      }
      if (!this.pickupAddress || this.pickupAddress.trim() === '') {
        this.validationErrors.push('Por favor ingrese la dirección');
      }
    }

    if (!this.serviceDate) {
      this.validationErrors.push('Por favor seleccione una fecha de servicio');
    }
    if (!this.serviceTime) {
      this.validationErrors.push('Por favor seleccione una hora de servicio');
    }

    if (this.serviceDate && this.serviceTime) {
      const selectedDateTime = new Date(
        this.serviceDate + 'T' + this.serviceTime
      );
      if (selectedDateTime < new Date()) {
        this.validationErrors.push(
          'La fecha y hora de servicio no puede ser en el pasado'
        );
      }
    }

    if (this.isRoundTrip) {
      if (!this.returnDate) {
        this.validationErrors.push('Por favor seleccione una fecha de regreso');
      }
      if (!this.returnTime) {
        this.validationErrors.push('Por favor seleccione una hora de regreso');
      }
    }

    return this.validationErrors.length === 0;
  }

  private calculatePrice(): PriceCalculation | null {
    const transferType = this.transferTypes.find(
      (t) => t.typeKey === this.selectedTransferType
    );
    if (!transferType) {
      return null;
    }

    let applicableTiers = this.pricingTiers.filter(
      (tier) =>
        tier.transferTypeId === transferType.id &&
        tier.minPassengers <= this.passengerCount &&
        tier.maxPassengers >= this.passengerCount
    );

    if (this.needsDestination() && this.selectedDestinationId) {
      applicableTiers = applicableTiers.filter(
        (tier) => tier.destinationId === this.selectedDestinationId
      );
    } else if (this.needsDestination()) {
      return null;
    } else {
      applicableTiers = applicableTiers.filter(
        (tier) => tier.destinationId === null
      );
    }

    if (applicableTiers.length === 0) {
      return null;
    }

    const pricingTier = applicableTiers[0];
    let basePrice = pricingTier.priceEur;

    if (
      this.isRoundTrip &&
      this.selectedTransferType !== 'one-day-tour' &&
      transferType.isRoundTripOption
    ) {
      basePrice = basePrice * 2;
    }

    const isEmergencyBooking = this.isWithin48Hours();
    const emergencyFee = isEmergencyBooking ? basePrice * 0.1 : 0;

    const subtotal = basePrice + emergencyFee;
    const serviceFee = subtotal * 0.085;

    const totalPrice = subtotal + serviceFee;

    return {
      basePrice,
      emergencyFee,
      serviceFee,
      totalPrice,
      pricingTier,
      isEmergencyBooking,
    };
  }

  private isWithin48Hours(): boolean {
    if (!this.serviceDate || !this.serviceTime) {
      return false;
    }
    const serviceDateTime = new Date(this.serviceDate + 'T' + this.serviceTime);
    const now = new Date();
    const hoursDifference =
      (serviceDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference <= 48;
  }

  onSearchTransfers(): void {
    if (!this.validateForm()) {
      this.showValidationAlert = true;
      setTimeout(() => {
        this.showValidationAlert = false;
      }, 5000);
      return;
    }

    this.priceCalculation = this.calculatePrice();

    if (!this.priceCalculation) {
      this.validationErrors = [
        'No se pudo calcular el precio. Por favor verifique los datos ingresados.',
      ];
      this.showValidationAlert = true;
      return;
    }

    this.showResults = true;

    setTimeout(() => {
      const resultsElement = document.querySelector('.booking-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  navigateToCheckout(): void {
    if (!this.priceCalculation) {
      return;
    }

    // Prepare booking data to pass to checkout
    const bookingData = {
      transferType: this.selectedTransferType,
      transferTypeName: this.getSelectedTransferTypeName(),
      destinationId: this.selectedDestinationId,
      destinationName: this.getSelectedDestinationName(),
      passengerCount: this.passengerCount,
      isRoundTrip: this.isRoundTrip,
      requiresWheelchairAccess: this.requiresWheelchairAccess,
      pickupType: this.pickupType,
      pickupName: this.pickupName,
      pickupAddress: this.pickupAddress,
      airportId: this.selectedAirportId,
      airportName: this.getSelectedAirportName(),
      terminalId: this.selectedTerminalId,
      terminalName: this.getSelectedTerminalName(),
      flightNumber: this.flightNumber,
      serviceDate: this.serviceDate,
      serviceTime: this.serviceTime,
      returnDate: this.returnDate,
      returnTime: this.returnTime,
      basePrice: this.priceCalculation.basePrice,
      emergencyFee: this.priceCalculation.emergencyFee,
      serviceFee: this.priceCalculation.serviceFee,
      totalPrice: this.priceCalculation.totalPrice,
      isEmergencyBooking: this.priceCalculation.isEmergencyBooking,
    };

    try {
      // Encode booking data for URL parameter
      const encodedData = encodeBookingData(bookingData);

      // Navigate to checkout with encoded booking data in URL
      this.router.navigate(['/van-transfer-checkout', encodedData]);
    } catch (error) {
      console.error(
        'Error encoding booking data, using fallback navigation:',
        error
      );

      // Fallback to the old method if encoding fails
      this.router.navigate(['/van-transfer-checkout'], {
        state: { bookingData },
      });
    }
  }

  getSelectedTransferTypeName(): string {
    const transferType = this.transferTypes.find(
      (t) => t.typeKey === this.selectedTransferType
    );
    return transferType?.name || '';
  }

  getSelectedDestinationName(): string {
    const destination = this.destinations.find(
      (d) => d.id === this.selectedDestinationId
    );
    return destination?.name || '';
  }

  getSelectedAirportName(): string {
    const airport = this.airports.find((a) => a.id === this.selectedAirportId);
    return airport?.name || '';
  }

  getSelectedTerminalName(): string {
    const terminal = this.airportTerminals.find(
      (t) => t.id === this.selectedTerminalId
    );
    return terminal?.terminalName || '';
  }

  closeValidationAlert(): void {
    this.showValidationAlert = false;
  }

  resetForm(): void {
    this.selectedTransferType = '';
    this.selectedDestinationId = null;
    this.passengerCount = 2;
    this.requiresWheelchairAccess = false;
    this.isRoundTrip = false;
    this.pickupType = '';
    this.pickupName = '';
    this.pickupAddress = '';
    this.selectedAirportId = null;
    this.selectedTerminalId = null;
    this.flightNumber = '';
    this.serviceDate = '';
    this.serviceTime = '10:00';
    this.returnDate = '';
    this.returnTime = '18:00';
    this.showResults = false;
    this.priceCalculation = null;
    this.validationErrors = [];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.serviceDate = tomorrow.toISOString().split('T')[0];
  }

  scrollToBooking(): void {
    const element = document.getElementById('van-transfers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getPickupTypeLabel(): string {
    switch (this.pickupType) {
      case 'hotel':
        return 'Hotel';
      case 'airport':
        return 'Aeropuerto';
      case 'airbnb':
        return 'Airbnb';
      default:
        return '';
    }
  }

  // Accordion Wizard Methods
  goToStep(step: number): void {
    // Only allow going to a step if previous steps are complete
    if (step <= this.currentStep + 1 || this.completedSteps.has(step)) {
      this.currentStep = step;
      // Scroll to the step when clicking on step headers
      this.scrollToActiveStep();
    }
  }

  isStepComplete(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.selectedTransferType;
      case 2:
        return !this.needsDestination() || !!this.selectedDestinationId;
      case 3:
        return this.passengerCount >= 1 && this.passengerCount <= 12;
      case 4:
        return true; // Round trip is optional
      case 5:
        return !!this.pickupType;
      case 6:
        return this.isPickupDetailsComplete();
      case 7:
        return !!this.serviceDate && !!this.serviceTime;
      case 8:
        return !this.isRoundTrip || (!!this.returnDate && !!this.returnTime);
      default:
        return false;
    }
  }

  isPickupDetailsComplete(): boolean {
    if (this.pickupType === 'hotel' || this.pickupType === 'airbnb') {
      return !!this.pickupName && !!this.pickupAddress;
    } else if (this.pickupType === 'airport') {
      return (
        !!this.selectedAirportId &&
        !!this.selectedTerminalId &&
        !!this.flightNumber
      );
    }
    return false;
  }

  canProceedToNextStep(currentStep: number): boolean {
    return this.isStepComplete(currentStep);
  }

  nextStep(): void {
    if (this.canProceedToNextStep(this.currentStep)) {
      this.completedSteps.add(this.currentStep);

      // Skip step 2 if destination is not needed
      if (this.currentStep === 1 && !this.needsDestination()) {
        this.currentStep = 3;
      }
      // Skip step 4 if round trip option is not shown
      else if (this.currentStep === 3 && !this.showRoundTripOption()) {
        this.currentStep = 5;
      }
      // Skip step 8 if not round trip - stay on step 7 and submit will be available
      else if (this.currentStep === 7 && !this.isRoundTrip) {
        // Don't advance - the submit button will show on step 7
        return;
      } else {
        this.currentStep++;
      }

      // Scroll to active step on mobile for better UX
      this.scrollToActiveStep();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      // Handle backward navigation with skipped steps
      if (this.currentStep === 3 && !this.needsDestination()) {
        this.currentStep = 1;
      } else if (this.currentStep === 5 && !this.showRoundTripOption()) {
        this.currentStep = 3;
      } else if (this.currentStep === 8 && !this.isRoundTrip) {
        this.currentStep = 7;
      } else {
        this.currentStep--;
      }

      // Scroll to active step on mobile for better UX
      this.scrollToActiveStep();
    }
  }

  scrollToActiveStep(): void {
    // Add a small delay to ensure DOM has updated
    setTimeout(() => {
      const activeStep = document.querySelector('.wizard-step.active');
      if (activeStep) {
        const stepHeader = activeStep.querySelector('.step-header');
        if (stepHeader) {
          // On mobile, scroll to keep the step nicely in view
          if (this.isMobile) {
            // Calculate offset to position step header near top of viewport
            const offset = 100; // Account for any sticky headers or spacing
            const elementPosition = stepHeader.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          } else {
            // On desktop, just bring into view gently
            stepHeader.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest',
            });
          }
        }
      }
    }, 150); // Reduced from 100ms for snappier feel
  }

  getTotalSteps(): number {
    let total = 8; // Base: 1-Type, 2-Dest, 3-Passengers&Wheelchair, 4-RoundTrip, 5-Pickup, 6-Details, 7-Date, 8-ReturnDate
    if (!this.needsDestination()) total--;
    if (!this.showRoundTripOption()) total--;
    if (!this.isRoundTrip) total--;
    return total;
  }

  getStepTitle(step: number): string {
    const titles: { [key: number]: string } = {
      1: 'Selecciona tu Servicio',
      2: 'Elige tu Destino',
      3: 'Pasajeros y Accesibilidad',
      4: 'Tipo de Viaje',
      5: 'Lugar de Recogida',
      6: 'Detalles de Recogida',
      7: 'Fecha y Hora',
      8: 'Fecha de Regreso',
    };
    return titles[step] || '';
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }

  isStepAccessible(step: number): boolean {
    if (step === 2 && !this.needsDestination()) return false;
    if (step === 4 && !this.showRoundTripOption()) return false;
    if (step === 8 && !this.isRoundTrip) return false;
    return step <= this.currentStep || this.completedSteps.has(step);
  }
}
