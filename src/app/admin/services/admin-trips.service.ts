import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoggerService } from '../../shared/services/logger.service';
import {
  TransferType,
  Destination,
  PricingTier,
  Airport,
  AirportTerminal,
  PickupType,
} from '../../shared/models/van-transfer.models';

const DOMAIN = 'https://garbrix.com/travel-ecommerce/api';

export interface AdminTripsResponse {
  transferTypes: TransferType[];
  destinations: Destination[];
  pricingTiers: PricingTier[];
  airports: Airport[];
  airportTerminals: AirportTerminal[];
  pickupTypes: PickupType[];
}

export interface CreateTransferTypeRequest {
  typeKey: string;
  name: string;
  description: string;
  isRoundTripOption: boolean;
  maxPassengers: number;
}

export interface UpdateTransferTypeRequest extends CreateTransferTypeRequest {
  id: number;
}

export interface CreateDestinationRequest {
  name: string;
  slug: string;
  duration: string;
  distance: string;
  isRoundTrip: boolean;
  description: string;
}

export interface UpdateDestinationRequest extends CreateDestinationRequest {
  id: number;
}

export interface CreatePricingTierRequest {
  transferTypeId: number;
  destinationId: number | null;
  minPassengers: number;
  maxPassengers: number;
  priceEur: number;
  isSingleTrip: boolean;
}

export interface UpdatePricingTierRequest extends CreatePricingTierRequest {
  id: number;
}

export interface CreateAirportRequest {
  code: string;
  name: string;
  city: string;
}

export interface UpdateAirportRequest extends CreateAirportRequest {
  id: number;
}

export interface CreatePickupTypeRequest {
  typeKey: string;
  name: string;
  description: string;
  requiresAddress: boolean;
  requiresAirport: boolean;
}

export interface UpdatePickupTypeRequest extends CreatePickupTypeRequest {
  id: number;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AdminTripsService {
  private GET_ALL_TRIPS = `${DOMAIN}/admin/getTrips.php`;
  private CREATE_TRANSFER_TYPE = `${DOMAIN}/admin/createTransferType.php`;
  private UPDATE_TRANSFER_TYPE = `${DOMAIN}/admin/updateTransferType.php`;
  private DELETE_TRANSFER_TYPE = `${DOMAIN}/admin/deleteTransferType.php`;
  private CREATE_DESTINATION = `${DOMAIN}/admin/createDestination.php`;
  private UPDATE_DESTINATION = `${DOMAIN}/admin/updateDestination.php`;
  private DELETE_DESTINATION = `${DOMAIN}/admin/deleteDestination.php`;
  private CREATE_PRICING_TIER = `${DOMAIN}/admin/createPricingTier.php`;
  private UPDATE_PRICING_TIER = `${DOMAIN}/admin/updatePricingTier.php`;
  private DELETE_PRICING_TIER = `${DOMAIN}/admin/deletePricingTier.php`;
  private CREATE_AIRPORT = `${DOMAIN}/admin/createAirport.php`;
  private UPDATE_AIRPORT = `${DOMAIN}/admin/updateAirport.php`;
  private DELETE_AIRPORT = `${DOMAIN}/admin/deleteAirport.php`;
  private CREATE_PICKUP_TYPE = `${DOMAIN}/admin/createPickupType.php`;
  private UPDATE_PICKUP_TYPE = `${DOMAIN}/admin/updatePickupType.php`;
  private DELETE_PICKUP_TYPE = `${DOMAIN}/admin/deletePickupType.php`;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  // Get all trips data
  getAllTrips(): Observable<AdminTripsResponse> {
    return this.http.post<AdminTripsResponse>(this.GET_ALL_TRIPS, {}).pipe(
      map((response) => {
        this.logger.log('✅ Admin trips data loaded:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error loading admin trips:', error);
        throw error;
      })
    );
  }

  // Transfer Types CRUD
  createTransferType(data: CreateTransferTypeRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.CREATE_TRANSFER_TYPE, data).pipe(
      map((response) => {
        this.logger.log('✅ Transfer type created:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating transfer type:', error);
        throw error;
      })
    );
  }

  updateTransferType(data: UpdateTransferTypeRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.UPDATE_TRANSFER_TYPE, data).pipe(
      map((response) => {
        this.logger.log('✅ Transfer type updated:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error updating transfer type:', error);
        throw error;
      })
    );
  }

  deleteTransferType(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.DELETE_TRANSFER_TYPE, { id }).pipe(
      map((response) => {
        this.logger.log('✅ Transfer type deleted:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error deleting transfer type:', error);
        throw error;
      })
    );
  }

  // Destinations CRUD
  createDestination(data: CreateDestinationRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.CREATE_DESTINATION, data).pipe(
      map((response) => {
        this.logger.log('✅ Destination created:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating destination:', error);
        throw error;
      })
    );
  }

  updateDestination(data: UpdateDestinationRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.UPDATE_DESTINATION, data).pipe(
      map((response) => {
        this.logger.log('✅ Destination updated:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error updating destination:', error);
        throw error;
      })
    );
  }

  deleteDestination(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.DELETE_DESTINATION, { id }).pipe(
      map((response) => {
        this.logger.log('✅ Destination deleted:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error deleting destination:', error);
        throw error;
      })
    );
  }

  // Pricing Tiers CRUD
  createPricingTier(data: CreatePricingTierRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.CREATE_PRICING_TIER, data).pipe(
      map((response) => {
        this.logger.log('✅ Pricing tier created:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating pricing tier:', error);
        throw error;
      })
    );
  }

  updatePricingTier(data: UpdatePricingTierRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.UPDATE_PRICING_TIER, data).pipe(
      map((response) => {
        this.logger.log('✅ Pricing tier updated:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error updating pricing tier:', error);
        throw error;
      })
    );
  }

  deletePricingTier(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.DELETE_PRICING_TIER, { id }).pipe(
      map((response) => {
        this.logger.log('✅ Pricing tier deleted:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error deleting pricing tier:', error);
        throw error;
      })
    );
  }

  // Airports CRUD
  createAirport(data: CreateAirportRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.CREATE_AIRPORT, data).pipe(
      map((response) => {
        this.logger.log('✅ Airport created:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating airport:', error);
        throw error;
      })
    );
  }

  updateAirport(data: UpdateAirportRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.UPDATE_AIRPORT, data).pipe(
      map((response) => {
        this.logger.log('✅ Airport updated:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error updating airport:', error);
        throw error;
      })
    );
  }

  deleteAirport(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.DELETE_AIRPORT, { id }).pipe(
      map((response) => {
        this.logger.log('✅ Airport deleted:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error deleting airport:', error);
        throw error;
      })
    );
  }

  // Pickup Types CRUD
  createPickupType(data: CreatePickupTypeRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.CREATE_PICKUP_TYPE, data).pipe(
      map((response) => {
        this.logger.log('✅ Pickup type created:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating pickup type:', error);
        throw error;
      })
    );
  }

  updatePickupType(data: UpdatePickupTypeRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.UPDATE_PICKUP_TYPE, data).pipe(
      map((response) => {
        this.logger.log('✅ Pickup type updated:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error updating pickup type:', error);
        throw error;
      })
    );
  }

  deletePickupType(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.DELETE_PICKUP_TYPE, { id }).pipe(
      map((response) => {
        this.logger.log('✅ Pickup type deleted:', response);
        return response;
      }),
      catchError((error) => {
        this.logger.error('❌ Error deleting pickup type:', error);
        throw error;
      })
    );
  }
}
