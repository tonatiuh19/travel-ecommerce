import { VisitorsAnalytics } from '../../models/visitors.models';

export interface AdminVisitorsState {
  analytics: VisitorsAnalytics | null;
  loading: boolean;
  error: string | null;
  dateFrom: string;
  dateTo: string;
}

export const initialAdminVisitorsState: AdminVisitorsState = {
  analytics: null,
  loading: false,
  error: null,
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // 30 days ago
  dateTo: new Date().toISOString().split('T')[0], // today
};
