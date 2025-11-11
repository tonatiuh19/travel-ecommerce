import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminTripsState } from '../states/admin-trips.state';

export const selectAdminTripsState =
  createFeatureSelector<AdminTripsState>('adminTrips');

export const selectTransferTypes = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.transferTypes
);

export const selectDestinations = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.destinations
);

export const selectPricingTiers = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.pricingTiers
);

export const selectAirports = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.airports
);

export const selectAirportTerminals = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.airportTerminals
);

export const selectPickupTypes = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.pickupTypes
);

export const selectLoading = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.loading
);

export const selectError = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => state.error
);

export const selectSelectedEntity = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => ({
    entityType: state.selectedEntityType,
    entityId: state.selectedEntityId,
  })
);

export const selectSelectedTransferType = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => {
    if (state.selectedEntityType === 'transferType' && state.selectedEntityId) {
      return state.transferTypes.find((t) => t.id === state.selectedEntityId);
    }
    return null;
  }
);

export const selectSelectedDestination = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => {
    if (state.selectedEntityType === 'destination' && state.selectedEntityId) {
      return state.destinations.find((d) => d.id === state.selectedEntityId);
    }
    return null;
  }
);

export const selectSelectedPricingTier = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => {
    if (state.selectedEntityType === 'pricingTier' && state.selectedEntityId) {
      return state.pricingTiers.find((p) => p.id === state.selectedEntityId);
    }
    return null;
  }
);

export const selectSelectedAirport = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => {
    if (state.selectedEntityType === 'airport' && state.selectedEntityId) {
      return state.airports.find((a) => a.id === state.selectedEntityId);
    }
    return null;
  }
);

export const selectSelectedPickupType = createSelector(
  selectAdminTripsState,
  (state: AdminTripsState) => {
    if (state.selectedEntityType === 'pickupType' && state.selectedEntityId) {
      return state.pickupTypes.find((p) => p.id === state.selectedEntityId);
    }
    return null;
  }
);
