export const DOMAIN = 'https://garbrix.com/travel-ecommerce/api';

export interface LandingState {
  packages: PackageModel[];
  isLoading: boolean;
  isError: boolean;
  reservation: any;
  isProcessingReservation: boolean;
  reservationError: any;
  isTesting: boolean;
  visitorTracking: {
    isTracking: boolean;
    trackingError: any;
  };
  exchangeRates: ExchangeRateState;
}

export interface PackageModel {
  packID: number;
  packTitle: string;
  packDescription: string;
  packLocationID: number;
  packHotelID: number;
  packHotelDescription: number | string;
  packLimit: number;
  packPrice: number;
  packTransportId: number;
  packTransportDescription: number | string;
  packDateRange: string;
  hotLabel: string;
  imageUrls: string[];
  citName?: string;
}

export interface VisitorData {
  device: string;
  section: string;
}

export interface VisitorResponse {
  success?: boolean;
  error?: string;
}

export enum VisitorSection {
  MAIN = 'main',
  PACKAGE_DETAILS = 'package_details',
  CHECKOUT = 'checkout',
  ABANDONED_CART = 'abandoned_cart',
  RESERVATION = 'reservation',
  PACKAGE_LIST = 'package_list',
}

export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    MXN: number;
  };
}

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  exchangeRate: number;
  lastUpdated: string;
}

export interface ExchangeRateState {
  eurToMxn: number | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
