import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoggerService } from '../../shared/services/logger.service';
import {
  VisitorsAnalytics,
  VisitorsDateRange,
} from '../models/visitors.models';

const DOMAIN = 'https://garbrix.com/travel-ecommerce/api';

@Injectable({
  providedIn: 'root',
})
export class AdminVisitorsService {
  private GET_VISITORS = `${DOMAIN}/admin/getVisitors.php`;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  getVisitorsAnalytics(
    dateRange?: VisitorsDateRange
  ): Observable<VisitorsAnalytics> {
    const body = dateRange || {};

    return this.http.post<VisitorsAnalytics>(this.GET_VISITORS, body).pipe(
      map((response) => {
        this.logger.log('✅ Visitors analytics loaded:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error loading visitors analytics:', error);
        throw error;
      })
    );
  }
}
