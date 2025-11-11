import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';
import * as AdminTripsActions from '../store/actions/admin-trips.actions';
import * as AdminTripsSelectors from '../store/selectors/admin-trips.selectors';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  PickupType,
} from '../../shared/models/van-transfer.models';

@Component({
  selector: 'app-admin-trips',
  templateUrl: './admin-trips.component.html',
  styleUrls: ['./admin-trips.component.css'],
})
export class AdminTripsComponent implements OnInit {
  transferTypes$: Observable<TransferType[]>;
  destinations$: Observable<Destination[]>;
  pricingTiers$: Observable<PricingTier[]>;
  airports$: Observable<Airport[]>;
  pickupTypes$: Observable<PickupType[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  showWizard = false;
  showEditModal = false;
  wizardEntityType:
    | 'transferType'
    | 'destination'
    | 'pricingTier'
    | 'airport'
    | 'pickupType'
    | null = null;
  editEntityType:
    | 'transferType'
    | 'destination'
    | 'pricingTier'
    | 'airport'
    | 'pickupType'
    | null = null;
  editEntityId: number | null = null;

  activeTab:
    | 'transferTypes'
    | 'destinations'
    | 'pricingTiers'
    | 'airports'
    | 'pickupTypes' = 'transferTypes';

  constructor(private store: Store, public authService: AdminAuthService) {
    this.transferTypes$ = this.store.select(
      AdminTripsSelectors.selectTransferTypes
    );
    this.destinations$ = this.store.select(
      AdminTripsSelectors.selectDestinations
    );
    this.pricingTiers$ = this.store.select(
      AdminTripsSelectors.selectPricingTiers
    );
    this.airports$ = this.store.select(AdminTripsSelectors.selectAirports);
    this.pickupTypes$ = this.store.select(
      AdminTripsSelectors.selectPickupTypes
    );
    this.loading$ = this.store.select(AdminTripsSelectors.selectLoading);
    this.error$ = this.store.select(AdminTripsSelectors.selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(AdminTripsActions.loadTripsData());
  }

  logout(): void {
    this.authService.logout();
  }

  openWizard(
    entityType:
      | 'transferType'
      | 'destination'
      | 'pricingTier'
      | 'airport'
      | 'pickupType'
  ): void {
    this.wizardEntityType = entityType;
    this.showWizard = true;
  }

  closeWizard(): void {
    this.showWizard = false;
    this.wizardEntityType = null;
  }

  openEditModal(
    entityType:
      | 'transferType'
      | 'destination'
      | 'pricingTier'
      | 'airport'
      | 'pickupType',
    entityId: number
  ): void {
    this.editEntityType = entityType;
    this.editEntityId = entityId;
    this.store.dispatch(
      AdminTripsActions.selectEntity({ entityType, entityId })
    );
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editEntityType = null;
    this.editEntityId = null;
    this.store.dispatch(AdminTripsActions.clearSelectedEntity());
  }

  deleteEntity(
    entityType:
      | 'transferType'
      | 'destination'
      | 'pricingTier'
      | 'airport'
      | 'pickupType',
    id: number,
    name: string
  ): void {
    if (confirm(`¿Está seguro que desea eliminar "${name}"?`)) {
      switch (entityType) {
        case 'transferType':
          this.store.dispatch(AdminTripsActions.deleteTransferType({ id }));
          break;
        case 'destination':
          this.store.dispatch(AdminTripsActions.deleteDestination({ id }));
          break;
        case 'pricingTier':
          this.store.dispatch(AdminTripsActions.deletePricingTier({ id }));
          break;
        case 'airport':
          this.store.dispatch(AdminTripsActions.deleteAirport({ id }));
          break;
        case 'pickupType':
          this.store.dispatch(AdminTripsActions.deletePickupType({ id }));
          break;
      }
    }
  }

  setActiveTab(
    tab:
      | 'transferTypes'
      | 'destinations'
      | 'pricingTiers'
      | 'airports'
      | 'pickupTypes'
  ): void {
    this.activeTab = tab;
  }

  getPricingTierLabel(
    tier: PricingTier,
    transferTypes: TransferType[],
    destinations: Destination[]
  ): string {
    const transferType = transferTypes.find(
      (t) => t.id === tier.transferTypeId
    );
    const destination = tier.destinationId
      ? destinations.find((d) => d.id === tier.destinationId)
      : null;
    return `${transferType?.name || 'N/A'} - ${
      destination?.name || 'General'
    } (${tier.minPassengers}-${tier.maxPassengers} pax) - €${tier.priceEur}`;
  }
}
