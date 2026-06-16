import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  AirportTerminal,
  PickupType,
} from '../models/van-transfer.models';
import { LoggerService } from './logger.service';

const DOMAIN = 'https://garbrix.com/travel-ecommerce/api';

export interface VanTransferBookingRequest {
  // Customer info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;

  // Booking info
  transferType: string;
  destinationId?: number | null;
  passengerCount: number;
  isRoundTrip: boolean;
  requiresWheelchairAccess?: boolean;

  // Pickup info
  pickupType: string;
  pickupName?: string;
  pickupAddress?: string;
  pickupAirportId?: number | null;
  pickupTerminalId?: number | null;
  pickupFlightNumber?: string;

  // Service date/time
  serviceDate: string;
  serviceTime: string;
  returnDate?: string;
  returnTime?: string;

  // Pricing
  basePrice: number;
  emergencyFee?: number;
  serviceFee: number;
  totalPrice: number;
  totalPriceEur?: number; // Original EUR price for display

  // Other
  specialRequests?: string;
  stripePaymentMethodId: string;
  paymentType?: string;
}

export interface VanTransferBookingResponse {
  success: boolean;
  booking_id: number;
  booking_reference: string;
  customer_id: number;
  payment_status: string;
  stripe_payment_intent_id: string;
  booking: any;
  totalPriceEur?: number; // Original EUR price for display
  error?: string;
  message?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VanTransferService {
  private GET_TRANSFER_SERVICE = `${DOMAIN}/getTransferService.php`;
  private CREATE_VAN_TRANSFER_BOOKING = `${DOMAIN}/createVanTransferBooking.php`;

  // Exchange rate API - using exchangerate-api.com (free tier)
  private EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/EUR';

  constructor(private http: HttpClient, private logger: LoggerService) {}

  /**
   * Get real-time EUR to MXN exchange rate
   */
  getExchangeRate(): Observable<number> {
    return this.http
      .get<{ rates: { MXN: number } }>(this.EXCHANGE_RATE_API)
      .pipe(
        map((response) => {
          const rate = response.rates.MXN;
          this.logger.log(`💱 Current EUR to MXN rate: ${rate}`);
          return rate;
        }),
        catchError((error) => {
          this.logger.error(
            '❌ Error fetching exchange rate, using fallback:',
            error
          );
          // Fallback rate if API fails (approximate rate as of 2025)
          return of(21.5);
        })
      );
  }

  getVanTransferData(): Observable<{
    transferTypes: TransferType[];
    destinations: Destination[];
    pricingTiers: PricingTier[];
    airports: Airport[];
    airportTerminals: AirportTerminal[];
    pickupTypes: PickupType[];
  }> {
    return this.http
      .post<{
        transferTypes: TransferType[];
        destinations: Destination[];
        pricingTiers: PricingTier[];
        airports: Airport[];
        airportTerminals: AirportTerminal[];
        pickupTypes: PickupType[];
      }>(this.GET_TRANSFER_SERVICE, {})
      .pipe(
        map((response) => {
          this.logger.log('✅ Van Transfer Data loaded from API:', response);
          return response;
        }),
        catchError((error) => {
          this.logger.error('❌ Error loading van transfer data:', error);
          // Return empty arrays as fallback
          return of({
            transferTypes: [],
            destinations: [],
            pricingTiers: [],
            airports: [],
            airportTerminals: [],
            pickupTypes: [],
          });
        })
      );
  }

  createVanTransferBooking(
    bookingData: VanTransferBookingRequest
  ): Observable<VanTransferBookingResponse> {
    return this.http
      .post<VanTransferBookingResponse>(
        this.CREATE_VAN_TRANSFER_BOOKING,
        bookingData
      )
      .pipe(
        map((response) => {
          this.logger.log('✅ Booking created successfully:', response);
          return response;
        }),
        catchError((error) => {
          this.logger.error('❌ Error creating booking:', error);
          throw error;
        })
      );
  }
}
