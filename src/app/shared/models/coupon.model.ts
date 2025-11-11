export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  bookingsCount?: number;
  totalDiscountsGiven?: number;
}

export interface CouponValidationRequest {
  code: string;
  totalAmount: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  error?: string;
  coupon?: {
    id: number;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
  };
  discountAmount?: number;
  finalPrice?: number;
}

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
}

export interface UpdateCouponRequest {
  id: number;
  code?: string;
  description?: string;
  discountType?: 'percentage' | 'fixed_amount';
  discountValue?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
}
