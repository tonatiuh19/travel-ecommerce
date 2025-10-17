import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VanTransferState } from '../../../shared/models/van-transfer.models';

export const selectVanTransferState =
  createFeatureSelector<VanTransferState>('vanTransfer');

export const selectTransferTypes = createSelector(
  selectVanTransferState,
  (state) => state.transferTypes
);

export const selectDestinations = createSelector(
  selectVanTransferState,
  (state) => state.destinations
);

export const selectPricingTiers = createSelector(
  selectVanTransferState,
  (state) => state.pricingTiers
);

export const selectAirports = createSelector(
  selectVanTransferState,
  (state) => state.airports
);

export const selectAirportTerminals = createSelector(
  selectVanTransferState,
  (state) => state.airportTerminals
);

export const selectPickupTypes = createSelector(
  selectVanTransferState,
  (state) => state.pickupTypes
);

export const selectLoading = createSelector(
  selectVanTransferState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectVanTransferState,
  (state) => state.error
);

export const selectCurrentBooking = createSelector(
  selectVanTransferState,
  (state) => state.currentBooking
);

export const selectBookingResponse = createSelector(
  selectVanTransferState,
  (state) => state.bookingResponse
);

export const selectIsProcessingBooking = createSelector(
  selectVanTransferState,
  (state) => state.loading
);

export const selectBookingError = createSelector(
  selectVanTransferState,
  (state) => state.error
);

// Get terminals for a specific airport
export const selectTerminalsForAirport = (airportId: number) =>
  createSelector(selectAirportTerminals, (terminals) =>
    terminals.filter((terminal) => terminal.airportId === airportId)
  );

// Get pricing for specific transfer type and destination
export const selectPricingForTransfer = (
  transferTypeId: number,
  destinationId: number | null
) =>
  createSelector(selectPricingTiers, (tiers) =>
    tiers.filter(
      (tier) =>
        tier.transferTypeId === transferTypeId &&
        (destinationId === null || tier.destinationId === destinationId)
    )
  );

// Get destinations for One Day Tour
export const selectOneDayTourDestinations = createSelector(
  selectDestinations,
  (destinations) => destinations
);
