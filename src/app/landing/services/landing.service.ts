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
  public CREATE_RESERVATION = `${DOMAIN}/createReservation.php`;

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
}
