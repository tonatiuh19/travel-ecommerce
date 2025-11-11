import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as AdminTripsActions from '../../store/actions/admin-trips.actions';
import * as AdminTripsSelectors from '../../store/selectors/admin-trips.selectors';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  PickupType,
} from '../../../shared/models/van-transfer.models';

@Component({
  selector: 'app-trip-edit-modal',
  templateUrl: './trip-edit-modal.component.html',
  styleUrls: ['./trip-edit-modal.component.css'],
})
export class TripEditModalComponent implements OnInit {
  @Input() entityType:
    | 'transferType'
    | 'destination'
    | 'pricingTier'
    | 'airport'
    | 'pickupType'
    | null = null;
  @Input() entityId: number | null = null;
  @Input() transferTypes: any[] = [];
  @Input() destinations: any[] = [];
  @Output() close = new EventEmitter<void>();

  // Forms
  transferTypeForm: any = null;
  destinationForm: any = null;
  pricingTierForm: any = null;
  airportForm: any = null;
  pickupTypeForm: any = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadEntityData();
  }

  loadEntityData(): void {
    switch (this.entityType) {
      case 'transferType':
        this.store
          .select(AdminTripsSelectors.selectSelectedTransferType)
          .pipe(
            filter((data): data is TransferType => data !== null),
            take(1)
          )
          .subscribe((data) => {
            this.transferTypeForm = { ...data };
          });
        break;
      case 'destination':
        this.store
          .select(AdminTripsSelectors.selectSelectedDestination)
          .pipe(
            filter((data): data is Destination => data !== null),
            take(1)
          )
          .subscribe((data) => {
            this.destinationForm = { ...data };
          });
        break;
      case 'pricingTier':
        this.store
          .select(AdminTripsSelectors.selectSelectedPricingTier)
          .pipe(
            filter((data): data is PricingTier => data !== null),
            take(1)
          )
          .subscribe((data) => {
            this.pricingTierForm = { ...data };
          });
        break;
      case 'airport':
        this.store
          .select(AdminTripsSelectors.selectSelectedAirport)
          .pipe(
            filter((data): data is Airport => data !== null),
            take(1)
          )
          .subscribe((data) => {
            this.airportForm = { ...data };
          });
        break;
      case 'pickupType':
        this.store
          .select(AdminTripsSelectors.selectSelectedPickupType)
          .pipe(
            filter((data): data is PickupType => data !== null),
            take(1)
          )
          .subscribe((data) => {
            this.pickupTypeForm = { ...data };
          });
        break;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    switch (this.entityType) {
      case 'transferType':
        if (this.transferTypeForm) {
          this.store.dispatch(
            AdminTripsActions.updateTransferType({
              data: this.transferTypeForm,
            })
          );
        }
        break;
      case 'destination':
        if (this.destinationForm) {
          this.store.dispatch(
            AdminTripsActions.updateDestination({ data: this.destinationForm })
          );
        }
        break;
      case 'pricingTier':
        if (this.pricingTierForm) {
          this.store.dispatch(
            AdminTripsActions.updatePricingTier({ data: this.pricingTierForm })
          );
        }
        break;
      case 'airport':
        if (this.airportForm) {
          this.store.dispatch(
            AdminTripsActions.updateAirport({ data: this.airportForm })
          );
        }
        break;
      case 'pickupType':
        if (this.pickupTypeForm) {
          this.store.dispatch(
            AdminTripsActions.updatePickupType({ data: this.pickupTypeForm })
          );
        }
        break;
    }
    this.onClose();
  }

  getTitle(): string {
    const titles: { [key: string]: string } = {
      transferType: 'Editar Tipo de Transfer',
      destination: 'Editar Destino',
      pricingTier: 'Editar Tarifa',
      airport: 'Editar Aeropuerto',
      pickupType: 'Editar Tipo de Recogida',
    };
    return titles[this.entityType || ''] || 'Editar Entidad';
  }

  generateSlug(): void {
    if (this.destinationForm) {
      this.destinationForm.slug = this.destinationForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }
}
