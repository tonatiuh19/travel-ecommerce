import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  AirportTerminal,
  PickupType,
} from '../../../shared/models/van-transfer.models';

export interface AdminTripsState {
  transferTypes: TransferType[];
  destinations: Destination[];
  pricingTiers: PricingTier[];
  airports: Airport[];
  airportTerminals: AirportTerminal[];
  pickupTypes: PickupType[];
  loading: boolean;
  error: string | null;
  selectedEntityType:
    | 'transferType'
    | 'destination'
    | 'pricingTier'
    | 'airport'
    | 'pickupType'
    | null;
  selectedEntityId: number | null;
}

export const initialAdminTripsState: AdminTripsState = {
  transferTypes: [],
  destinations: [],
  pricingTiers: [],
  airports: [],
  airportTerminals: [],
  pickupTypes: [],
  loading: false,
  error: null,
  selectedEntityType: null,
  selectedEntityId: null,
};
