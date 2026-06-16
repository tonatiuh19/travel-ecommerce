export interface VisitorDailyStat {
  date: string;
  visitors: number;
  mobile: number;
  desktop: number;
}

export interface VisitorDeviceStat {
  device: string;
  count: number;
}

export interface VisitorSectionStat {
  section: string;
  count: number;
}

export interface VisitorsAnalytics {
  dailyStats: VisitorDailyStat[];
  deviceStats: VisitorDeviceStat[];
  sectionStats: VisitorSectionStat[];
  totalVisitors: number;
}

export interface VisitorsDateRange {
  dateFrom: string;
  dateTo: string;
}
