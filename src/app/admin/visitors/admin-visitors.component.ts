import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  faChartLine,
  faMobileAlt,
  faDesktop,
  faCalendar,
  faSpinner,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { AdminAuthService } from '../services/admin-auth.service';
import * as AdminVisitorsActions from '../store/actions/admin-visitors.actions';
import * as AdminVisitorsSelectors from '../store/selectors/admin-visitors.selectors';
import {
  VisitorDailyStat,
  VisitorDeviceStat,
  VisitorSectionStat,
} from '../models/visitors.models';

@Component({
  selector: 'app-admin-visitors',
  templateUrl: './admin-visitors.component.html',
  styleUrls: ['./admin-visitors.component.css'],
})
export class AdminVisitorsComponent implements OnInit, OnDestroy {
  // Icons
  faChartLine = faChartLine;
  faMobileAlt = faMobileAlt;
  faDesktop = faDesktop;
  faCalendar = faCalendar;
  faSpinner = faSpinner;
  faUsers = faUsers;

  dailyStats: VisitorDailyStat[] = [];
  deviceStats: VisitorDeviceStat[] = [];
  sectionStats: VisitorSectionStat[] = [];
  totalVisitors = 0;
  isLoading = false;
  error: string | null = null;

  dateFrom = '';
  dateTo = '';

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private authService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to selectors
    this.store
      .select(AdminVisitorsSelectors.selectDailyStats)
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats) => {
        this.dailyStats = stats;
      });

    this.store
      .select(AdminVisitorsSelectors.selectDeviceStats)
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats) => {
        this.deviceStats = stats;
      });

    this.store
      .select(AdminVisitorsSelectors.selectSectionStats)
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats) => {
        this.sectionStats = stats;
      });

    this.store
      .select(AdminVisitorsSelectors.selectTotalVisitors)
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.totalVisitors = total;
      });

    this.store
      .select(AdminVisitorsSelectors.selectLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isLoading = loading;
      });

    this.store
      .select(AdminVisitorsSelectors.selectError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error = error;
      });

    this.store
      .select(AdminVisitorsSelectors.selectDateRange)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ dateFrom, dateTo }) => {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
      });

    // Load initial data
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.store.dispatch(AdminVisitorsActions.loadVisitorsAnalytics({}));
  }

  onDateRangeChange(): void {
    if (this.dateFrom && this.dateTo) {
      this.store.dispatch(
        AdminVisitorsActions.updateDateRange({
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
        })
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  getDevicePercentage(device: string): number {
    const stat = this.deviceStats.find((s) => s.device === device);
    if (!stat || this.totalVisitors === 0) return 0;
    return Math.round((stat.count / this.totalVisitors) * 100);
  }

  getSectionPercentage(section: string): number {
    const stat = this.sectionStats.find((s) => s.section === section);
    if (!stat || this.totalVisitors === 0) return 0;
    return Math.round((stat.count / this.totalVisitors) * 100);
  }
}
