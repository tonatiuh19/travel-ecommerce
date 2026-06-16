import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AdminVisitorsService } from '../../services/admin-visitors.service';
import * as AdminVisitorsActions from '../actions/admin-visitors.actions';

@Injectable()
export class AdminVisitorsEffects {
  loadVisitorsAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminVisitorsActions.loadVisitorsAnalytics),
      switchMap(({ dateRange }) =>
        this.adminVisitorsService.getVisitorsAnalytics(dateRange).pipe(
          map((analytics) =>
            AdminVisitorsActions.loadVisitorsAnalyticsSuccess({ analytics })
          ),
          catchError((error) =>
            of(
              AdminVisitorsActions.loadVisitorsAnalyticsFailure({
                error: error.message || 'Failed to load visitors analytics',
              })
            )
          )
        )
      )
    )
  );

  updateDateRange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminVisitorsActions.updateDateRange),
      map(({ dateFrom, dateTo }) =>
        AdminVisitorsActions.loadVisitorsAnalytics({
          dateRange: { dateFrom, dateTo },
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private adminVisitorsService: AdminVisitorsService
  ) {}
}
