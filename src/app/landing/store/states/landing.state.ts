import { LandingState } from '../../landing.model';

export const LANDING_FEATURE_KEY = 'landing';

export const initialLandingState: LandingState = {
  packages: [],
  isLoading: false,
  isError: false,
};
