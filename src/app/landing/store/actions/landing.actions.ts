import { createAction, props } from '@ngrx/store';
import { VisitorData } from '../../landing.model';

const actor = '[Landing]';

export const getPackages = createAction(
  `${actor} Get Packages`,
  props<{ userId: string }>()
);

export const getPackagesSuccess = createAction(
  `${actor} Get Packages Success`,
  props<{ packagesResponse: any }>()
);

export const getPackagesFailure = createAction(
  `${actor} Get Packages Failure`,
  props<{ errorResponse: any }>()
);

export const createReservation = createAction(
  `${actor} Create Reservation`,
  props<{
    userInfo: {
      name: string;
      email: string;
      phone: string;
      country: string;
      birth_date?: string;
      passport_no?: string;
    };
    reservationInfo: {
      service_type: string;
      origin: string;
      destination: string;
      pickup_type?: string;
      pickup_airport?: string;
      pickup_flight_number?: string;
      pickup_airline?: string;
      pickup_terminal?: string;
      pickup_hotel_name?: string;
      pickup_address?: string;
      pickup_datetime: string;
      return_datetime?: string;
      passengers: number;
      wheelchair_access?: number;
      special_note?: string;
      price: number;
      price_eur: string;
      urgency_trip?: number;
      status?: string;
    };
    stripeToken: string;
    payment_type: string;
    displayCurrency?: 'EUR' | 'MXN';
  }>()
);

export const createReservationSuccess = createAction(
  `${actor} Create Reservation Success`,
  props<{ reservationResponse: any }>()
);

export const createReservationFailure = createAction(
  `${actor} Create Reservation Failure`,
  props<{ errorResponse: any }>()
);

export const clearReservation = createAction(`${actor} Clear Reservation`);

export const getReservationByCode = createAction(
  `${actor} Get Reservation By Code`,
  props<{ reservationCode: string }>()
);

export const getReservationByCodeSuccess = createAction(
  `${actor} Get Reservation By Code Success`,
  props<{ reservation: any }>()
);

export const getReservationByCodeFailure = createAction(
  `${actor} Get Reservation By Code Failure`,
  props<{ error: string }>()
);

export const clearReservationLookup = createAction(
  `${actor} Clear Reservation Lookup`
);

// Visitor tracking actions
export const trackVisitor = createAction(
  `${actor} Track Visitor`,
  props<{ section: string }>()
);

export const trackVisitorSuccess = createAction(
  `${actor} Track Visitor Success`,
  props<{ response: any }>()
);

export const trackVisitorFailure = createAction(
  `${actor} Track Visitor Failure`,
  props<{ error: any }>()
);

// Exchange rate actions
export const getExchangeRate = createAction(
  `${actor} Get Exchange Rate`,
  props<{ fromCurrency: string; toCurrency: string }>()
);

export const getExchangeRateSuccess = createAction(
  `${actor} Get Exchange Rate Success`,
  props<{ exchangeRate: number; lastUpdated: string }>()
);

export const getExchangeRateFailure = createAction(
  `${actor} Get Exchange Rate Failure`,
  props<{ error: any }>()
);

export const authenticateAdmin = createAction(
  `${actor} Authenticate Admin`,
  props<{ password: string }>()
);

export const authenticateAdminSuccess = createAction(
  `${actor} Authenticate Admin Success`
);

export const authenticateAdminFailure = createAction(
  `${actor} Authenticate Admin Failure`
);

export const toggleTestingMode = createAction(
  `${actor} Toggle Testing Mode`,
  props<{ isEnabled: boolean }>()
);

export const logoutAdmin = createAction(`${actor} Logout Admin`);

export const convertCurrency = createAction(
  `${actor} Convert Currency`,
  props<{ amount: number; fromCurrency: string; toCurrency: string }>()
);

export const getStripeTest = createAction(`${actor} Get Stripe Test`);

export const getStripeTestSuccess = createAction(
  `${actor} Get Stripe Test Success`,
  props<{ response: any }>()
);

export const getStripeTestFailure = createAction(
  `${actor} Get Stripe Test Failure`,
  props<{ error: any }>()
);
