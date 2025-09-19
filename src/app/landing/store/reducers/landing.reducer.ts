import { Action, createReducer, on } from '@ngrx/store';
import { createRehydrateReducer } from '../../../shared/utils/rehydrate-reducer';
import {
  initialLandingState,
  LANDING_FEATURE_KEY,
} from '../states/landing.state';
import { LandingActions } from '../actions';
import { LandingState } from '../../landing.model';

export const LandingReducer = createRehydrateReducer(
  { key: LANDING_FEATURE_KEY },
  initialLandingState,
  on(LandingActions.getPackages, (state: LandingState, { userId }: any) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(
    LandingActions.getPackagesSuccess,
    (state: LandingState, { packagesResponse }: any) => {
      return {
        ...state,
        packages: packagesResponse,
        isLoading: false,
        isError: false,
      };
    }
  ),
  on(
    LandingActions.getPackagesFailure,
    (state: LandingState, { errorResponse }: any) => {
      return {
        ...state,
        ...initialLandingState,
        isLoading: false,
        isError: true,
      };
    }
  ),
  on(LandingActions.createReservation, (state: LandingState) => {
    return {
      ...state,
      isProcessingReservation: true,
      reservationError: null,
    };
  }),
  on(
    LandingActions.createReservationSuccess,
    (state: LandingState, { reservationResponse }: any) => {
      return {
        ...state,
        reservation: reservationResponse,
        isProcessingReservation: false,
        reservationError: null,
      };
    }
  ),
  on(
    LandingActions.createReservationFailure,
    (state: LandingState, { errorResponse }: any) => {
      return {
        ...state,
        reservation: null,
        isProcessingReservation: false,
        reservationError: errorResponse,
      };
    }
  ),
  on(LandingActions.clearReservation, (state: LandingState) => {
    return {
      ...state,
      reservation: null,
      isProcessingReservation: false,
      reservationError: null,
    };
  }),
  on(LandingActions.getReservationByCode, (state: LandingState) => {
    return {
      ...state,
      isProcessingReservation: true,
      reservationError: null,
      reservation: null,
    };
  }),
  on(
    LandingActions.getReservationByCodeSuccess,
    (state: LandingState, { reservation }: any) => {
      return {
        ...state,
        reservation: reservation,
        isProcessingReservation: false,
        reservationError: null,
      };
    }
  ),
  on(
    LandingActions.getReservationByCodeFailure,
    (state: LandingState, { error }: any) => {
      return {
        ...state,
        reservation: null,
        isProcessingReservation: false,
        reservationError: error,
      };
    }
  ),
  on(LandingActions.clearReservationLookup, (state: LandingState) => {
    return {
      ...state,
      reservation: null,
      isProcessingReservation: false,
      reservationError: null,
    };
  })
);
