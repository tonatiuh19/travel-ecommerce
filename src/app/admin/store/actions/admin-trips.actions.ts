import { createAction, props } from '@ngrx/store';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  PickupType,
  AirportTerminal,
} from '../../../shared/models/van-transfer.models';
import {
  CreateTransferTypeRequest,
  UpdateTransferTypeRequest,
  CreateDestinationRequest,
  UpdateDestinationRequest,
  CreatePricingTierRequest,
  UpdatePricingTierRequest,
  CreateAirportRequest,
  UpdateAirportRequest,
  CreatePickupTypeRequest,
  UpdatePickupTypeRequest,
} from '../../services/admin-trips.service';

const actor = '[Admin Trips]';

// Load all trips data
export const loadTripsData = createAction(`${actor} Load Trips Data`);

export const loadTripsDataSuccess = createAction(
  `${actor} Load Trips Data Success`,
  props<{
    transferTypes: TransferType[];
    destinations: Destination[];
    pricingTiers: PricingTier[];
    airports: Airport[];
    airportTerminals: AirportTerminal[];
    pickupTypes: PickupType[];
  }>()
);

export const loadTripsDataFailure = createAction(
  `${actor} Load Trips Data Failure`,
  props<{ error: string }>()
);

// Transfer Types
export const createTransferType = createAction(
  `${actor} Create Transfer Type`,
  props<{ data: CreateTransferTypeRequest }>()
);

export const createTransferTypeSuccess = createAction(
  `${actor} Create Transfer Type Success`,
  props<{ transferType: TransferType }>()
);

export const createTransferTypeFailure = createAction(
  `${actor} Create Transfer Type Failure`,
  props<{ error: string }>()
);

export const updateTransferType = createAction(
  `${actor} Update Transfer Type`,
  props<{ data: UpdateTransferTypeRequest }>()
);

export const updateTransferTypeSuccess = createAction(
  `${actor} Update Transfer Type Success`,
  props<{ transferType: TransferType }>()
);

export const updateTransferTypeFailure = createAction(
  `${actor} Update Transfer Type Failure`,
  props<{ error: string }>()
);

export const deleteTransferType = createAction(
  `${actor} Delete Transfer Type`,
  props<{ id: number }>()
);

export const deleteTransferTypeSuccess = createAction(
  `${actor} Delete Transfer Type Success`,
  props<{ id: number }>()
);

export const deleteTransferTypeFailure = createAction(
  `${actor} Delete Transfer Type Failure`,
  props<{ error: string }>()
);

// Destinations
export const createDestination = createAction(
  `${actor} Create Destination`,
  props<{ data: CreateDestinationRequest }>()
);

export const createDestinationSuccess = createAction(
  `${actor} Create Destination Success`,
  props<{ destination: Destination }>()
);

export const createDestinationFailure = createAction(
  `${actor} Create Destination Failure`,
  props<{ error: string }>()
);

export const updateDestination = createAction(
  `${actor} Update Destination`,
  props<{ data: UpdateDestinationRequest }>()
);

export const updateDestinationSuccess = createAction(
  `${actor} Update Destination Success`,
  props<{ destination: Destination }>()
);

export const updateDestinationFailure = createAction(
  `${actor} Update Destination Failure`,
  props<{ error: string }>()
);

export const deleteDestination = createAction(
  `${actor} Delete Destination`,
  props<{ id: number }>()
);

export const deleteDestinationSuccess = createAction(
  `${actor} Delete Destination Success`,
  props<{ id: number }>()
);

export const deleteDestinationFailure = createAction(
  `${actor} Delete Destination Failure`,
  props<{ error: string }>()
);

// Pricing Tiers
export const createPricingTier = createAction(
  `${actor} Create Pricing Tier`,
  props<{ data: CreatePricingTierRequest }>()
);

export const createPricingTierSuccess = createAction(
  `${actor} Create Pricing Tier Success`,
  props<{ pricingTier: PricingTier }>()
);

export const createPricingTierFailure = createAction(
  `${actor} Create Pricing Tier Failure`,
  props<{ error: string }>()
);

export const updatePricingTier = createAction(
  `${actor} Update Pricing Tier`,
  props<{ data: UpdatePricingTierRequest }>()
);

export const updatePricingTierSuccess = createAction(
  `${actor} Update Pricing Tier Success`,
  props<{ pricingTier: PricingTier }>()
);

export const updatePricingTierFailure = createAction(
  `${actor} Update Pricing Tier Failure`,
  props<{ error: string }>()
);

export const deletePricingTier = createAction(
  `${actor} Delete Pricing Tier`,
  props<{ id: number }>()
);

export const deletePricingTierSuccess = createAction(
  `${actor} Delete Pricing Tier Success`,
  props<{ id: number }>()
);

export const deletePricingTierFailure = createAction(
  `${actor} Delete Pricing Tier Failure`,
  props<{ error: string }>()
);

// Airports
export const createAirport = createAction(
  `${actor} Create Airport`,
  props<{ data: CreateAirportRequest }>()
);

export const createAirportSuccess = createAction(
  `${actor} Create Airport Success`,
  props<{ airport: Airport }>()
);

export const createAirportFailure = createAction(
  `${actor} Create Airport Failure`,
  props<{ error: string }>()
);

export const updateAirport = createAction(
  `${actor} Update Airport`,
  props<{ data: UpdateAirportRequest }>()
);

export const updateAirportSuccess = createAction(
  `${actor} Update Airport Success`,
  props<{ airport: Airport }>()
);

export const updateAirportFailure = createAction(
  `${actor} Update Airport Failure`,
  props<{ error: string }>()
);

export const deleteAirport = createAction(
  `${actor} Delete Airport`,
  props<{ id: number }>()
);

export const deleteAirportSuccess = createAction(
  `${actor} Delete Airport Success`,
  props<{ id: number }>()
);

export const deleteAirportFailure = createAction(
  `${actor} Delete Airport Failure`,
  props<{ error: string }>()
);

// Pickup Types
export const createPickupType = createAction(
  `${actor} Create Pickup Type`,
  props<{ data: CreatePickupTypeRequest }>()
);

export const createPickupTypeSuccess = createAction(
  `${actor} Create Pickup Type Success`,
  props<{ pickupType: PickupType }>()
);

export const createPickupTypeFailure = createAction(
  `${actor} Create Pickup Type Failure`,
  props<{ error: string }>()
);

export const updatePickupType = createAction(
  `${actor} Update Pickup Type`,
  props<{ data: UpdatePickupTypeRequest }>()
);

export const updatePickupTypeSuccess = createAction(
  `${actor} Update Pickup Type Success`,
  props<{ pickupType: PickupType }>()
);

export const updatePickupTypeFailure = createAction(
  `${actor} Update Pickup Type Failure`,
  props<{ error: string }>()
);

export const deletePickupType = createAction(
  `${actor} Delete Pickup Type`,
  props<{ id: number }>()
);

export const deletePickupTypeSuccess = createAction(
  `${actor} Delete Pickup Type Success`,
  props<{ id: number }>()
);

export const deletePickupTypeFailure = createAction(
  `${actor} Delete Pickup Type Failure`,
  props<{ error: string }>()
);

// UI Actions
export const selectEntity = createAction(
  `${actor} Select Entity`,
  props<{
    entityType:
      | 'transferType'
      | 'destination'
      | 'pricingTier'
      | 'airport'
      | 'pickupType';
    entityId: number;
  }>()
);

export const clearSelectedEntity = createAction(
  `${actor} Clear Selected Entity`
);
