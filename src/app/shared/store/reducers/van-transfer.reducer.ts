import { createReducer, on } from '@ngrx/store';
import { VanTransferState } from '../../../shared/models/van-transfer.models';
import * as VanTransferActions from '../actions/van-transfer.actions';

export const initialState: VanTransferState = {
  transferTypes: [],
  destinations: [],
  pricingTiers: [],
  airports: [],
  airportTerminals: [],
  pickupTypes: [],
  loading: false,
  error: null,
  currentBooking: null,
  bookingResponse: null,
};

export const vanTransferReducer = createReducer(
  initialState,

  // Load Van Transfer Data
  on(VanTransferActions.loadVanTransferData, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VanTransferActions.loadVanTransferDataSuccess, (state, action) => ({
    ...state,
    transferTypes: action.transferTypes,
    destinations: action.destinations,
    pricingTiers: action.pricingTiers,
    airports: action.airports,
    airportTerminals: action.airportTerminals,
    pickupTypes: action.pickupTypes,
    loading: false,
    error: null,
  })),

  on(VanTransferActions.loadVanTransferDataFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // Create Booking
  on(VanTransferActions.createBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VanTransferActions.createBookingSuccess, (state, action) => ({
    ...state,
    currentBooking: action.booking,
    loading: false,
    error: null,
  })),

  on(VanTransferActions.createBookingFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // Clear Current Booking
  on(VanTransferActions.clearCurrentBooking, (state) => ({
    ...state,
    currentBooking: null,
  })),

  // Process Van Transfer Booking with Payment
  on(VanTransferActions.processVanTransferBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
    bookingResponse: null,
  })),

  on(VanTransferActions.processVanTransferBookingSuccess, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    bookingResponse: action.response,
  })),

  on(VanTransferActions.processVanTransferBookingFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
    bookingResponse: null,
  })),

  // Clear Van Transfer Booking
  on(VanTransferActions.clearVanTransferBooking, (state) => ({
    ...state,
    loading: false,
    error: null,
    bookingResponse: null,
  }))
);
