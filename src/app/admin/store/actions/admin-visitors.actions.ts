import { createAction, props } from '@ngrx/store';
import {
  VisitorsAnalytics,
  VisitorsDateRange,
} from '../../models/visitors.models';

const actor = '[Admin Visitors]';

// Load visitors analytics
export const loadVisitorsAnalytics = createAction(
  `${actor} Load Visitors Analytics`,
  props<{ dateRange?: VisitorsDateRange }>()
);

export const loadVisitorsAnalyticsSuccess = createAction(
  `${actor} Load Visitors Analytics Success`,
  props<{ analytics: VisitorsAnalytics }>()
);

export const loadVisitorsAnalyticsFailure = createAction(
  `${actor} Load Visitors Analytics Failure`,
  props<{ error: string }>()
);

// Update date range
export const updateDateRange = createAction(
  `${actor} Update Date Range`,
  props<{ dateFrom: string; dateTo: string }>()
);
