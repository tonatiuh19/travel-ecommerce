import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
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

  constructor(
    private actions$: Actions,
    private store: Store,
    private landingService: LandingService
  ) {}
}
