import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { VanTransferService } from '../../services/van-transfer.service';
import { LoggerService } from '../../services/logger.service';
import * as VanTransferActions from '../actions/van-transfer.actions';

@Injectable()
export class VanTransferEffects {
  loadVanTransferData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VanTransferActions.loadVanTransferData),
      switchMap(() =>
        this.vanTransferService.getVanTransferData().pipe(
          map((data) =>
            VanTransferActions.loadVanTransferDataSuccess({
              transferTypes: data.transferTypes,
              destinations: data.destinations,
              pricingTiers: data.pricingTiers,
              airports: data.airports,
              airportTerminals: data.airportTerminals,
              pickupTypes: data.pickupTypes,
            })
          ),
          catchError((error) =>
            of(
              VanTransferActions.loadVanTransferDataFailure({
                error: error.message || 'Failed to load van transfer data',
              })
            )
          )
        )
      )
    )
  );

  processVanTransferBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VanTransferActions.processVanTransferBooking),
      switchMap(({ bookingRequest }) =>
        // First, get the current EUR to MXN exchange rate
        this.vanTransferService.getExchangeRate().pipe(
          switchMap((exchangeRate) => {
            // Convert EUR prices to MXN
            const basePrice = bookingRequest.basePrice * exchangeRate;
            const emergencyFee = bookingRequest.emergencyFee
              ? bookingRequest.emergencyFee * exchangeRate
              : 0;
            const serviceFee = bookingRequest.serviceFee * exchangeRate;
            const totalPrice = bookingRequest.totalPrice * exchangeRate;

            // Create updated booking request with MXN prices and original EUR price
            const updatedBookingRequest = {
              ...bookingRequest,
              totalPriceEur: bookingRequest.totalPrice,
              basePrice: Math.round(basePrice * 100) / 100, // Round to 2 decimals
              emergencyFee: Math.round(emergencyFee * 100) / 100,
              serviceFee: Math.round(serviceFee * 100) / 100,
              totalPrice: Math.round(totalPrice * 100) / 100,
            };

            this.logger.log(
              `💱 Converting prices: EUR ${bookingRequest.totalPrice} → MXN ${updatedBookingRequest.totalPrice} (Rate: ${exchangeRate})`
            );

            // Now create the booking with converted prices
            return this.vanTransferService
              .createVanTransferBooking(updatedBookingRequest)
              .pipe(
                map((response) => {
                  // Check if the API returned an error
                  if (response.error) {
                    return VanTransferActions.processVanTransferBookingFailure({
                      error: {
                        message: response.message || response.error,
                        type: response.type || 'api_error',
                      },
                    });
                  }
                  // Success case - include EUR price in response
                  return VanTransferActions.processVanTransferBookingSuccess({
                    response: {
                      ...response,
                      totalPriceEur: updatedBookingRequest.totalPriceEur,
                    },
                  });
                }),
                catchError((error) => {
                  const errorMessage =
                    error?.error?.message ||
                    error?.message ||
                    'Error al procesar la reserva';
                  return of(
                    VanTransferActions.processVanTransferBookingFailure({
                      error: {
                        message: errorMessage,
                        type: error?.error?.type || 'network_error',
                      },
                    })
                  );
                })
              );
          }),
          catchError((error) => {
            // Handle exchange rate fetch error
            const errorMessage =
              'Error al obtener la tasa de cambio. Por favor, intenta de nuevo.';
            this.logger.error('❌ Exchange rate error:', error);
            return of(
              VanTransferActions.processVanTransferBookingFailure({
                error: {
                  message: errorMessage,
                  type: 'exchange_rate_error',
                },
              })
            );
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private vanTransferService: VanTransferService,
    private logger: LoggerService
  ) {}
}
