import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LANDING_FEATURE_KEY } from '../states/landing.state';
import { LandingState } from '../../landing.model';

export const selectLandingState =
  createFeatureSelector<LandingState>(LANDING_FEATURE_KEY);

export const selectIsLoading = createSelector(
  selectLandingState,
  (state: LandingState) => state.isLoading
);

export const selectPackages = createSelector(
  selectLandingState,
  (state: LandingState) => state.packages
);

export const selectReservation = createSelector(
  selectLandingState,
  (state: LandingState) => state.reservation
);

export const selectIsProcessingReservation = createSelector(
  selectLandingState,
  (state: LandingState) => state.isProcessingReservation
);

export const selectReservationError = createSelector(
  selectLandingState,
  (state: LandingState) => state.reservationError
);

// Aliases for reservation lookup functionality
export const selectReservationLoading = createSelector(
  selectLandingState,
  (state: LandingState) => state.isProcessingReservation
);

// Exchange rate selectors
export const selectExchangeRates = createSelector(
  selectLandingState,
  (state: LandingState) => state.exchangeRates
);

export const selectEurToMxnRate = createSelector(
  selectExchangeRates,
  (exchangeRates) => exchangeRates.eurToMxn
);

export const selectExchangeRateLoading = createSelector(
  selectExchangeRates,
  (exchangeRates) => exchangeRates.isLoading
);

export const selectExchangeRateError = createSelector(
  selectExchangeRates,
  (exchangeRates) => exchangeRates.error
);

export const selectExchangeRateLastUpdated = createSelector(
  selectExchangeRates,
  (exchangeRates) => exchangeRates.lastUpdated
);

// Testing mode selectors
export const selectIsTesting = createSelector(
  selectLandingState,
  (state: LandingState) => state.isTesting
);
