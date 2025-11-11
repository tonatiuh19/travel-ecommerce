import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Coupon,
  CouponValidationRequest,
  CouponValidationResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../models/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiUrl = 'https://garbrix.com/travel-ecommerce/api';

  constructor(private http: HttpClient) {}

  /**
   * Validate a coupon code and calculate discount
   */
  validateCoupon(
    request: CouponValidationRequest
  ): Observable<CouponValidationResponse> {
    return this.http.post<CouponValidationResponse>(
      `${this.apiUrl}/validateCoupon.php`,
      request
    );
  }

  /**
   * Get all coupons (Admin only)
   */
  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.apiUrl}/admin/getCoupons.php`);
  }

  /**
   * Create a new coupon (Admin only)
   */
  createCoupon(
    request: CreateCouponRequest
  ): Observable<{ success: boolean; message: string; couponId: number }> {
    return this.http.post<{
      success: boolean;
      message: string;
      couponId: number;
    }>(`${this.apiUrl}/admin/createCoupon.php`, request);
  }

  /**
   * Update an existing coupon (Admin only)
   */
  updateCoupon(
    request: UpdateCouponRequest
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/admin/updateCoupon.php`,
      request
    );
  }

  /**
   * Delete a coupon (Admin only)
   * Note: If coupon has been used, it will be deactivated instead
   */
  deleteCoupon(
    id: number
  ): Observable<{
    success: boolean;
    message: string;
    deleted?: boolean;
    deactivated?: boolean;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      deleted?: boolean;
      deactivated?: boolean;
    }>(`${this.apiUrl}/admin/deleteCoupon.php`, { id });
  }
}
