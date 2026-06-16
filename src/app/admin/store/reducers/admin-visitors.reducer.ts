import { createReducer, on } from '@ngrx/store';
import {
  AdminVisitorsState,
  initialAdminVisitorsState,
} from '../states/admin-visitors.state';
import * as AdminVisitorsActions from '../actions/admin-visitors.actions';

export const adminVisitorsReducer = createReducer(
  initialAdminVisitorsState,

  // Load Visitors Analytics
  on(
    AdminVisitorsActions.loadVisitorsAnalytics,
    (state): AdminVisitorsState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(
    AdminVisitorsActions.loadVisitorsAnalyticsSuccess,
    (state, { analytics }): AdminVisitorsState => ({
      ...state,
      analytics,
      loading: false,
      error: null,
    })
  ),

  on(
    AdminVisitorsActions.loadVisitorsAnalyticsFailure,
    (state, { error }): AdminVisitorsState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Update Date Range
  on(
    AdminVisitorsActions.updateDateRange,
    (state, { dateFrom, dateTo }): AdminVisitorsState => ({
      ...state,
      dateFrom,
      dateTo,
    })
  )
);
