import { createAction, props } from '@ngrx/store';

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
      urgency_trip?: number;
      status?: string;
    };
    stripeToken: string;
    payment_type: string;
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
