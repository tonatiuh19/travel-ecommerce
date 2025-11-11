import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AdminTripsService } from '../../services/admin-trips.service';
import * as AdminTripsActions from '../actions/admin-trips.actions';

@Injectable()
export class AdminTripsEffects {
  loadTripsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.loadTripsData),
      switchMap(() =>
        this.adminTripsService.getAllTrips().pipe(
          map((response) =>
            AdminTripsActions.loadTripsDataSuccess({
              transferTypes: response.transferTypes,
              destinations: response.destinations,
              pricingTiers: response.pricingTiers,
              airports: response.airports,
              airportTerminals: response.airportTerminals,
              pickupTypes: response.pickupTypes,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.loadTripsDataFailure({
                error: error.message || 'Failed to load trips data',
              })
            )
          )
        )
      )
    )
  );

  // Transfer Type Effects
  createTransferType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createTransferType),
      switchMap(({ data }) =>
        this.adminTripsService.createTransferType(data).pipe(
          map((response) =>
            AdminTripsActions.createTransferTypeSuccess({
              transferType: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.createTransferTypeFailure({
                error: error.message || 'Failed to create transfer type',
              })
            )
          )
        )
      )
    )
  );

  createTransferTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createTransferTypeSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  updateTransferType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updateTransferType),
      switchMap(({ data }) =>
        this.adminTripsService.updateTransferType(data).pipe(
          map((response) =>
            AdminTripsActions.updateTransferTypeSuccess({
              transferType: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.updateTransferTypeFailure({
                error: error.message || 'Failed to update transfer type',
              })
            )
          )
        )
      )
    )
  );

  updateTransferTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updateTransferTypeSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  deleteTransferType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deleteTransferType),
      switchMap(({ id }) =>
        this.adminTripsService.deleteTransferType(id).pipe(
          map(() => AdminTripsActions.deleteTransferTypeSuccess({ id })),
          catchError((error) =>
            of(
              AdminTripsActions.deleteTransferTypeFailure({
                error: error.message || 'Failed to delete transfer type',
              })
            )
          )
        )
      )
    )
  );

  deleteTransferTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deleteTransferTypeSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  // Destination Effects
  createDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createDestination),
      switchMap(({ data }) =>
        this.adminTripsService.createDestination(data).pipe(
          map((response) =>
            AdminTripsActions.createDestinationSuccess({
              destination: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.createDestinationFailure({
                error: error.message || 'Failed to create destination',
              })
            )
          )
        )
      )
    )
  );

  createDestinationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createDestinationSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  updateDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updateDestination),
      switchMap(({ data }) =>
        this.adminTripsService.updateDestination(data).pipe(
          map((response) =>
            AdminTripsActions.updateDestinationSuccess({
              destination: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.updateDestinationFailure({
                error: error.message || 'Failed to update destination',
              })
            )
          )
        )
      )
    )
  );

  updateDestinationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updateDestinationSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  deleteDestination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deleteDestination),
      switchMap(({ id }) =>
        this.adminTripsService.deleteDestination(id).pipe(
          map(() => AdminTripsActions.deleteDestinationSuccess({ id })),
          catchError((error) =>
            of(
              AdminTripsActions.deleteDestinationFailure({
                error: error.message || 'Failed to delete destination',
              })
            )
          )
        )
      )
    )
  );

  deleteDestinationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deleteDestinationSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  // Pricing Tier Effects
  createPricingTier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createPricingTier),
      switchMap(({ data }) =>
        this.adminTripsService.createPricingTier(data).pipe(
          map((response) =>
            AdminTripsActions.createPricingTierSuccess({
              pricingTier: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.createPricingTierFailure({
                error: error.message || 'Failed to create pricing tier',
              })
            )
          )
        )
      )
    )
  );

  createPricingTierSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createPricingTierSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  updatePricingTier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updatePricingTier),
      switchMap(({ data }) =>
        this.adminTripsService.updatePricingTier(data).pipe(
          map((response) =>
            AdminTripsActions.updatePricingTierSuccess({
              pricingTier: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.updatePricingTierFailure({
                error: error.message || 'Failed to update pricing tier',
              })
            )
          )
        )
      )
    )
  );

  updatePricingTierSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updatePricingTierSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  deletePricingTier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deletePricingTier),
      switchMap(({ id }) =>
        this.adminTripsService.deletePricingTier(id).pipe(
          map(() => AdminTripsActions.deletePricingTierSuccess({ id })),
          catchError((error) =>
            of(
              AdminTripsActions.deletePricingTierFailure({
                error: error.message || 'Failed to delete pricing tier',
              })
            )
          )
        )
      )
    )
  );

  deletePricingTierSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deletePricingTierSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  // Airport Effects
  createAirport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createAirport),
      switchMap(({ data }) =>
        this.adminTripsService.createAirport(data).pipe(
          map((response) =>
            AdminTripsActions.createAirportSuccess({
              airport: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.createAirportFailure({
                error: error.message || 'Failed to create airport',
              })
            )
          )
        )
      )
    )
  );

  createAirportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createAirportSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  updateAirport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updateAirport),
      switchMap(({ data }) =>
        this.adminTripsService.updateAirport(data).pipe(
          map((response) =>
            AdminTripsActions.updateAirportSuccess({
              airport: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.updateAirportFailure({
                error: error.message || 'Failed to update airport',
              })
            )
          )
        )
      )
    )
  );

  updateAirportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updateAirportSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  deleteAirport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deleteAirport),
      switchMap(({ id }) =>
        this.adminTripsService.deleteAirport(id).pipe(
          map(() => AdminTripsActions.deleteAirportSuccess({ id })),
          catchError((error) =>
            of(
              AdminTripsActions.deleteAirportFailure({
                error: error.message || 'Failed to delete airport',
              })
            )
          )
        )
      )
    )
  );

  deleteAirportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deleteAirportSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  // Pickup Type Effects
  createPickupType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createPickupType),
      switchMap(({ data }) =>
        this.adminTripsService.createPickupType(data).pipe(
          map((response) =>
            AdminTripsActions.createPickupTypeSuccess({
              pickupType: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.createPickupTypeFailure({
                error: error.message || 'Failed to create pickup type',
              })
            )
          )
        )
      )
    )
  );

  createPickupTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.createPickupTypeSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  updatePickupType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updatePickupType),
      switchMap(({ data }) =>
        this.adminTripsService.updatePickupType(data).pipe(
          map((response) =>
            AdminTripsActions.updatePickupTypeSuccess({
              pickupType: response.data,
            })
          ),
          catchError((error) =>
            of(
              AdminTripsActions.updatePickupTypeFailure({
                error: error.message || 'Failed to update pickup type',
              })
            )
          )
        )
      )
    )
  );

  updatePickupTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.updatePickupTypeSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  deletePickupType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deletePickupType),
      switchMap(({ id }) =>
        this.adminTripsService.deletePickupType(id).pipe(
          map(() => AdminTripsActions.deletePickupTypeSuccess({ id })),
          catchError((error) =>
            of(
              AdminTripsActions.deletePickupTypeFailure({
                error: error.message || 'Failed to delete pickup type',
              })
            )
          )
        )
      )
    )
  );

  deletePickupTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminTripsActions.deletePickupTypeSuccess),
      map(() => AdminTripsActions.loadTripsData())
    )
  );

  constructor(
    private actions$: Actions,
    private adminTripsService: AdminTripsService
  ) {}
}
