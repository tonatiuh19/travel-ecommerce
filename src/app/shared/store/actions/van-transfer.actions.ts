import { createAction, props } from '@ngrx/store';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  AirportTerminal,
  PickupType,
  Booking,
} from '../../../shared/models/van-transfer.models';
import {
  VanTransferBookingRequest,
  VanTransferBookingResponse,
} from '../../services/van-transfer.service';

// Load Van Transfer Data
export const loadVanTransferData = createAction(
  '[Van Transfer] Load Van Transfer Data'
);

export const loadVanTransferDataSuccess = createAction(
  '[Van Transfer] Load Van Transfer Data Success',
  props<{
    transferTypes: TransferType[];
    destinations: Destination[];
    pricingTiers: PricingTier[];
    airports: Airport[];
    airportTerminals: AirportTerminal[];
    pickupTypes: PickupType[];
  }>()
);

export const loadVanTransferDataFailure = createAction(
  '[Van Transfer] Load Van Transfer Data Failure',
  props<{ error: string }>()
);

// Create Booking
export const createBooking = createAction(
  '[Van Transfer] Create Booking',
  props<{ booking: Booking }>()
);

export const createBookingSuccess = createAction(
  '[Van Transfer] Create Booking Success',
  props<{ booking: Booking }>()
);

export const createBookingFailure = createAction(
  '[Van Transfer] Create Booking Failure',
  props<{ error: string }>()
);

// Clear Current Booking
export const clearCurrentBooking = createAction(
  '[Van Transfer] Clear Current Booking'
);

// Process Van Transfer Booking with Payment
export const processVanTransferBooking = createAction(
  '[Van Transfer] Process Van Transfer Booking',
  props<{ bookingRequest: VanTransferBookingRequest }>()
);

export const processVanTransferBookingSuccess = createAction(
  '[Van Transfer] Process Van Transfer Booking Success',
  props<{ response: VanTransferBookingResponse }>()
);

export const processVanTransferBookingFailure = createAction(
  '[Van Transfer] Process Van Transfer Booking Failure',
  props<{ error: any }>()
);

// Clear Booking State
export const clearVanTransferBooking = createAction(
  '[Van Transfer] Clear Van Transfer Booking'
);
