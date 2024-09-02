import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { DOMAIN } from '../landing.model';

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  public GET_PACKAGES = `${DOMAIN}/getPackages.php`;
  public GET_PACKAGES_BY_ID = `${DOMAIN}/getPackagesById.php`;

  constructor(private httpClient: HttpClient) {}

  public getPackages(userId: string): Observable<any> {
    return this.httpClient
      .post(this.GET_PACKAGES, {
        empID: userId,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public getPackagesById(userId: string, packID: number): Observable<any> {
    return this.httpClient
      .post(this.GET_PACKAGES_BY_ID, {
        empID: userId,
        packID: packID,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public extractFirstDate(dateRange: string): string {
    const parts = dateRange.split(' ');
    const firstDatePart = parts[0].trim();
    return firstDatePart;
  }

  public extractSecondDate(dateRange: string): string {
    const parts = dateRange.split(' ');
    const dateAfterSecondSpace = parts[2].trim();
    return dateAfterSecondSpace;
  }
}
