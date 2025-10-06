import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import {
  DOMAIN,
  VisitorData,
  VisitorResponse,
  ExchangeRateResponse,
  CurrencyConversion,
} from '../landing.model';

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  public GET_PACKAGES = `${DOMAIN}/getPackages.php`;
  public GET_PACKAGES_BY_ID = `${DOMAIN}/getPackagesById.php`;
  public CREATE_RESERVATION = `${DOMAIN}/createReservation.php`;
  public GET_RESERVATION_BY_CODE = `${DOMAIN}/getReservationByCode.php`;
  public INSERT_VISITOR = `${DOMAIN}/insertVisitor.php`;
  public GET_STRIPE_TEST = `${DOMAIN}/getStripeTest.php`;

  // Exchange rate API endpoints
  private EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest';
  private FIXER_API = 'https://api.fixer.io/latest';

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

  public getStripeTest(): Observable<any> {
    return this.httpClient.post(this.GET_STRIPE_TEST, {}).pipe(
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

  public createReservation(
    userInfo: {
      name: string;
      email: string;
      phone: string;
      country: string;
      birth_date?: string;
      passport_no?: string;
    },
    reservationInfo: {
      service_type: string;
      origin: string;
      destination: string;
      pickup_type?: string;
      pickup_airport?: string;
      pickup_flight_number?: string;
      pickup_airline?: string;
      pickup_terminal?: string;
      pickup_hotel_name?: string;
      pickup_address?: string;
      pickup_datetime: string;
      return_datetime?: string;
      passengers: number;
      wheelchair_access?: number;
      special_note?: string;
      price: number;
      price_eur: string;
      urgency_trip?: number;
      status?: string;
    },
    stripeToken: string,
    paymentType: string
  ): Observable<any> {
    const payload = {
      // User information
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      country: userInfo.country,
      birth_date: userInfo.birth_date,
      passport_no: userInfo.passport_no,

      // Reservation information
      service_type: reservationInfo.service_type,
      origin: reservationInfo.origin,
      destination: reservationInfo.destination,
      pickup_type: reservationInfo.pickup_type,
      pickup_airport: reservationInfo.pickup_airport,
      pickup_flight_number: reservationInfo.pickup_flight_number,
      pickup_airline: reservationInfo.pickup_airline,
      pickup_terminal: reservationInfo.pickup_terminal,
      pickup_hotel_name: reservationInfo.pickup_hotel_name,
      pickup_address: reservationInfo.pickup_address,
      pickup_datetime: reservationInfo.pickup_datetime,
      return_datetime: reservationInfo.return_datetime,
      passengers: reservationInfo.passengers,
      wheelchair_access: reservationInfo.wheelchair_access,
      special_note: reservationInfo.special_note,
      price: reservationInfo.price,
      price_eur: reservationInfo.price_eur,
      urgency_trip: reservationInfo.urgency_trip,
      status: reservationInfo.status || 'pending',

      // Payment information
      token: stripeToken,
      payment_type: paymentType,
    };

    return this.httpClient.post(this.CREATE_RESERVATION, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  public getReservationByCode(reservationCode: string): Observable<any> {
    return this.httpClient
      .post(this.GET_RESERVATION_BY_CODE, {
        reservation_code: reservationCode,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public insertVisitor(visitorData: VisitorData): Observable<VisitorResponse> {
    return this.httpClient
      .post<VisitorResponse>(this.INSERT_VISITOR, visitorData)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public trackVisitor(section: string): Observable<VisitorResponse> {
    // Skip tracking on localhost/development environment
    if (this.isLocalhost()) {
      return of({ success: true });
    }

    const device = this.detectDevice();
    return this.insertVisitor({ device, section });
  }

  private isLocalhost(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.includes('localhost')
    );
  }

  private detectDevice(): string {
    const userAgent = navigator.userAgent;

    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }

    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      )
    ) {
      return 'mobile';
    }

    return 'desktop';
  }

  public getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Observable<ExchangeRateResponse> {
    // Use exchangerate-api.com as it's free and reliable
    const url = `${this.EXCHANGE_RATE_API}/${fromCurrency}`;

    return this.httpClient.get<any>(url).pipe(
      map((response) => {
        // Transform the response to match our interface
        const exchangeRateResponse: ExchangeRateResponse = {
          success: true,
          timestamp: Date.now(),
          base: fromCurrency,
          date: response.date || new Date().toISOString().split('T')[0],
          rates: {
            MXN: response.rates[toCurrency] || 0,
          },
        };
        return exchangeRateResponse;
      })
    );
  }

  public convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRate: number
  ): CurrencyConversion {
    const convertedAmount = amount * exchangeRate;

    return {
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimals
      exchangeRate,
      lastUpdated: new Date().toISOString(),
    };
  }

  public getEurToMxnRate(): Observable<number> {
    return this.getExchangeRate('EUR', 'MXN').pipe(
      map((response) => response.rates.MXN)
    );
  }
}
