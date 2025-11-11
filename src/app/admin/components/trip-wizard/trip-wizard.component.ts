import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AdminTripsActions from '../../store/actions/admin-trips.actions';

@Component({
  selector: 'app-trip-wizard',
  templateUrl: './trip-wizard.component.html',
  styleUrls: ['./trip-wizard.component.css'],
})
export class TripWizardComponent implements OnInit {
  @Input() entityType:
    | 'transferType'
    | 'destination'
    | 'pricingTier'
    | 'airport'
    | 'pickupType'
    | null = null;
  @Input() transferTypes: any[] = [];
  @Input() destinations: any[] = [];
  @Output() close = new EventEmitter<void>();

  currentStep = 1;
  totalSteps = 1;

  // Transfer Type Form
  transferTypeForm = {
    typeKey: '',
    name: '',
    description: '',
    isRoundTripOption: false,
    maxPassengers: 8,
  };

  // Destination Form
  destinationForm = {
    name: '',
    slug: '',
    duration: '',
    distance: '',
    isRoundTrip: false,
    description: '',
  };

  // Pricing Tier Form
  pricingTierForm = {
    transferTypeId: 0,
    destinationId: null as number | null,
    minPassengers: 1,
    maxPassengers: 8,
    priceEur: 0,
    isSingleTrip: false,
  };

  // Airport Form
  airportForm = {
    code: '',
    name: '',
    city: '',
  };

  // Pickup Type Form
  pickupTypeForm = {
    typeKey: '',
    name: '',
    description: '',
    requiresAddress: false,
    requiresAirport: false,
  };

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.setTotalSteps();
  }

  setTotalSteps(): void {
    switch (this.entityType) {
      case 'transferType':
      case 'airport':
      case 'pickupType':
        this.totalSteps = 2;
        break;
      case 'destination':
        this.totalSteps = 3;
        break;
      case 'pricingTier':
        this.totalSteps = 3;
        break;
      default:
        this.totalSteps = 1;
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  canProceed(): boolean {
    switch (this.entityType) {
      case 'transferType':
        if (this.currentStep === 1) {
          return (
            !!this.transferTypeForm.typeKey && !!this.transferTypeForm.name
          );
        }
        return true;
      case 'destination':
        if (this.currentStep === 1) {
          return !!this.destinationForm.name && !!this.destinationForm.slug;
        }
        if (this.currentStep === 2) {
          return (
            !!this.destinationForm.duration && !!this.destinationForm.distance
          );
        }
        return true;
      case 'pricingTier':
        if (this.currentStep === 1) {
          return this.pricingTierForm.transferTypeId > 0;
        }
        if (this.currentStep === 2) {
          return (
            this.pricingTierForm.minPassengers > 0 &&
            this.pricingTierForm.maxPassengers >=
              this.pricingTierForm.minPassengers
          );
        }
        return true;
      case 'airport':
        if (this.currentStep === 1) {
          return !!this.airportForm.code && !!this.airportForm.name;
        }
        return true;
      case 'pickupType':
        if (this.currentStep === 1) {
          return !!this.pickupTypeForm.typeKey && !!this.pickupTypeForm.name;
        }
        return true;
      default:
        return false;
    }
  }

  onSubmit(): void {
    switch (this.entityType) {
      case 'transferType':
        this.store.dispatch(
          AdminTripsActions.createTransferType({ data: this.transferTypeForm })
        );
        break;
      case 'destination':
        this.store.dispatch(
          AdminTripsActions.createDestination({ data: this.destinationForm })
        );
        break;
      case 'pricingTier':
        this.store.dispatch(
          AdminTripsActions.createPricingTier({ data: this.pricingTierForm })
        );
        break;
      case 'airport':
        this.store.dispatch(
          AdminTripsActions.createAirport({ data: this.airportForm })
        );
        break;
      case 'pickupType':
        this.store.dispatch(
          AdminTripsActions.createPickupType({ data: this.pickupTypeForm })
        );
        break;
    }
    this.onClose();
  }

  generateSlug(): void {
    this.destinationForm.slug = this.destinationForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  generateTypeKey(form: any, field: string): void {
    form[field] = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  getTitle(): string {
    const titles: { [key: string]: string } = {
      transferType: 'Crear Tipo de Transfer',
      destination: 'Crear Destino',
      pricingTier: 'Crear Tarifa',
      airport: 'Crear Aeropuerto',
      pickupType: 'Crear Tipo de Recogida',
    };
    return titles[this.entityType || ''] || 'Crear Entidad';
  }
}
