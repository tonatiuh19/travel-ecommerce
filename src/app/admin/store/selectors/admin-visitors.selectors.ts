import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminVisitorsState } from '../states/admin-visitors.state';

export const selectAdminVisitorsState =
  createFeatureSelector<AdminVisitorsState>('adminVisitors');

export const selectVisitorsAnalytics = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.analytics
);

export const selectDailyStats = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.analytics?.dailyStats || []
);

export const selectDeviceStats = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.analytics?.deviceStats || []
);

export const selectSectionStats = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.analytics?.sectionStats || []
);

export const selectTotalVisitors = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.analytics?.totalVisitors || 0
);

export const selectLoading = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.loading
);

export const selectError = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => state.error
);

export const selectDateRange = createSelector(
  selectAdminVisitorsState,
  (state: AdminVisitorsState) => ({
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
  })
);
