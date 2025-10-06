import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  switchMap,
  map,
  catchError,
  withLatestFrom,
  filter,
  take,
  timeout,
  startWith,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { LandingActions } from '../actions';
import { fromLanding } from '../selectors';
import { LandingService } from '../../services/landing.service';

@Injectable()
export class LandingEffects {
  gettingPackages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.getPackages),
      switchMap(() => {
        return this.landingService.getPackages('1').pipe(
          map((response) => {
            return LandingActions.getPackagesSuccess({
              packagesResponse: response,
            });
          }),
          catchError((error) => {
            return of(
              LandingActions.getPackagesFailure({ errorResponse: error })
            );
          })
        );
      })
    );
  });

  creatingReservation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.createReservation),
      switchMap(({ userInfo, reservationInfo, stripeToken, payment_type }) => {
        // Helper function to create reservation with a given rate
        const createReservationWithRate = (finalRate: number) => {
          const convertedReservationInfo = { ...reservationInfo };
          convertedReservationInfo.price = reservationInfo.price * finalRate;

          return this.landingService
            .createReservation(
              userInfo,
              convertedReservationInfo,
              stripeToken,
              payment_type
            )
            .pipe(
              map((response) => {
                if (response === false) {
                  return LandingActions.createReservationFailure({
                    errorResponse: { message: 'Payment failed' },
                  });
                }
                return LandingActions.createReservationSuccess({
                  reservationResponse: response,
                });
              }),
              catchError((error) => {
                return of(
                  LandingActions.createReservationFailure({
                    errorResponse: error,
                  })
                );
              })
            );
        };

        // Always fetch fresh exchange rate first
        this.store.dispatch(
          LandingActions.getExchangeRate({
            fromCurrency: 'EUR',
            toCurrency: 'MXN',
          })
        );

        // Wait for the fresh rate to be available, with timeout and fallback
        return this.store.select(fromLanding.selectEurToMxnRate).pipe(
          filter((newRate) => !!newRate), // Only proceed when we have a valid rate
          take(1), // Take only the first valid rate to avoid multiple emissions
          timeout(10000), // Timeout after 10 seconds (increased for fresh fetch)
          catchError(() => {
            // If timeout or error, use fallback rate
            return of(20);
          }),
          switchMap((finalRate) => createReservationWithRate(finalRate || 20))
        );
      })
    );
  });

  gettingReservationByCode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.getReservationByCode),
      switchMap(({ reservationCode }) => {
        return this.landingService.getReservationByCode(reservationCode).pipe(
          map((response) => {
            // Check if response has error
            if (response && response.error) {
              return LandingActions.getReservationByCodeFailure({
                error: response.error,
              });
            }
            return LandingActions.getReservationByCodeSuccess({
              reservation: response,
            });
          }),
          catchError((error) => {
            return of(
              LandingActions.getReservationByCodeFailure({
                error: error.message || 'Error al buscar la reserva',
              })
            );
          })
        );
      })
    );
  });

  trackingVisitor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.trackVisitor),
      switchMap(({ section }) => {
        return this.landingService.trackVisitor(section).pipe(
          map((response) => {
            return LandingActions.trackVisitorSuccess({
              response: response,
            });
          }),
          catchError((error) => {
            return of(
              LandingActions.trackVisitorFailure({
                error: error,
              })
            );
          })
        );
      })
    );
  });

  gettingExchangeRate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.getExchangeRate),
      switchMap(({ fromCurrency, toCurrency }) => {
        return this.landingService
          .getExchangeRate(fromCurrency, toCurrency)
          .pipe(
            map((response) => {
              return LandingActions.getExchangeRateSuccess({
                exchangeRate: response.rates.MXN,
                lastUpdated: response.date,
              });
            }),
            catchError((error) => {
              return of(
                LandingActions.getExchangeRateFailure({
                  error: error,
                })
              );
            })
          );
      })
    );
  });

  authenticatingAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.authenticateAdmin),
      switchMap(({ password }) => {
        // Check against fixed password
        const ADMIN_PASSWORD = 'Testing!0';

        if (password === ADMIN_PASSWORD) {
          return of(LandingActions.authenticateAdminSuccess());
        } else {
          return of(LandingActions.authenticateAdminFailure());
        }
      })
    );
  });

  getStripeTest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingActions.getStripeTest),
      switchMap(() => {
        return this.landingService.getStripeTest().pipe(
          map((response) => {
            return LandingActions.getStripeTestSuccess({
              response: response,
            });
          }),
          catchError((error) => {
            return of(
              LandingActions.getStripeTestFailure({
                error: error,
              })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private landingService: LandingService
  ) {}
}
