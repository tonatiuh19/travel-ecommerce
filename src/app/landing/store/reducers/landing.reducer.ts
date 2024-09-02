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
  )
);
