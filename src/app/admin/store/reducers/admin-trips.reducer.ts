import { createReducer, on } from '@ngrx/store';
import {
  AdminTripsState,
  initialAdminTripsState,
} from '../states/admin-trips.state';
import * as AdminTripsActions from '../actions/admin-trips.actions';

export const adminTripsReducer = createReducer(
  initialAdminTripsState,

  // Load Trips Data
  on(
    AdminTripsActions.loadTripsData,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.loadTripsDataSuccess,
    (
      state,
      {
        transferTypes,
        destinations,
        pricingTiers,
        airports,
        airportTerminals,
        pickupTypes,
      }
    ): AdminTripsState => ({
      ...state,
      transferTypes,
      destinations,
      pricingTiers,
      airports,
      airportTerminals,
      pickupTypes,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.loadTripsDataFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Transfer Types
  on(
    AdminTripsActions.createTransferType,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createTransferTypeSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createTransferTypeFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.updateTransferType,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updateTransferTypeSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updateTransferTypeFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.deleteTransferType,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deleteTransferTypeSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deleteTransferTypeFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Destinations
  on(
    AdminTripsActions.createDestination,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createDestinationSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createDestinationFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.updateDestination,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updateDestinationSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updateDestinationFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.deleteDestination,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deleteDestinationSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deleteDestinationFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Pricing Tiers
  on(
    AdminTripsActions.createPricingTier,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createPricingTierSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createPricingTierFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.updatePricingTier,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updatePricingTierSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updatePricingTierFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.deletePricingTier,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deletePricingTierSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deletePricingTierFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Airports
  on(
    AdminTripsActions.createAirport,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createAirportSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createAirportFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.updateAirport,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updateAirportSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updateAirportFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.deleteAirport,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deleteAirportSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deleteAirportFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Pickup Types
  on(
    AdminTripsActions.createPickupType,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createPickupTypeSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.createPickupTypeFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.updatePickupType,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updatePickupTypeSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.updatePickupTypeFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  on(
    AdminTripsActions.deletePickupType,
    (state): AdminTripsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deletePickupTypeSuccess,
    (state): AdminTripsState => ({
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminTripsActions.deletePickupTypeFailure,
    (state, { error }): AdminTripsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // UI Actions
  on(
    AdminTripsActions.selectEntity,
    (state, { entityType, entityId }): AdminTripsState => ({
      ...state,
      selectedEntityType: entityType,
      selectedEntityId: entityId,
    })
  ),

  on(
    AdminTripsActions.clearSelectedEntity,
    (state): AdminTripsState => ({
      ...state,
      selectedEntityType: null,
      selectedEntityId: null,
    })
  )
);
