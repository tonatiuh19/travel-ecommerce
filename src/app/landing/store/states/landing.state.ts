import { LandingState } from '../../landing.model';

export const LANDING_FEATURE_KEY = 'landingTravelEcommerce';

export const initialLandingState: LandingState = {
  packages: [],
  isLoading: false,
  isError: false,
  reservation: null,
  isProcessingReservation: false,
  reservationError: null,
  isTesting: false,
  visitorTracking: {
    isTracking: false,
    trackingError: null,
  },
  exchangeRates: {
    eurToMxn: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
};
