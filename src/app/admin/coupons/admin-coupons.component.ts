import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  faPlus,
  faEdit,
  faTrash,
  faTicket,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { CouponService } from '../../shared/services/coupon.service';
import { AdminAuthService } from '../services/admin-auth.service';
import {
  Coupon,
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../../shared/models/coupon.model';

@Component({
  selector: 'app-admin-coupons',
  templateUrl: './admin-coupons.component.html',
  styleUrls: ['./admin-coupons.component.css'],
})
export class AdminCouponsComponent implements OnInit, OnDestroy {
  // Icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faTicket = faTicket;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;
  faEye = faEye;

  coupons: Coupon[] = [];
  isLoading = false;
  error: string | null = null;

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  selectedCoupon: Coupon | null = null;

  // Form data
  couponForm: CreateCouponRequest = {
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchaseAmount: 0,
    isActive: true,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private couponService: CouponService,
    private authService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCoupons(): void {
    this.isLoading = true;
    this.error = null;

    this.couponService
      .getCoupons()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (coupons) => {
          this.coupons = coupons;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar cupones';
          this.isLoading = false;
          console.error('Error loading coupons:', error);
        },
      });
  }

  openCreateModal(): void {
    this.couponForm = {
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minPurchaseAmount: 0,
      isActive: true,
    };
    this.showCreateModal = true;
  }

  openEditModal(coupon: Coupon): void {
    this.selectedCoupon = coupon;
    this.couponForm = {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      usageLimit: coupon.usageLimit,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive,
    };
    this.showEditModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.selectedCoupon = null;
  }

  createCoupon(): void {
    if (!this.couponForm.code || !this.couponForm.discountValue) {
      return;
    }

    this.isLoading = true;

    this.couponService
      .createCoupon(this.couponForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Coupon created:', response);
          this.closeModals();
          this.loadCoupons();
        },
        error: (error) => {
          this.error = 'Error al crear cupón';
          this.isLoading = false;
          console.error('Error creating coupon:', error);
        },
      });
  }

  updateCoupon(): void {
    if (!this.selectedCoupon || !this.couponForm.code) {
      return;
    }

    this.isLoading = true;

    const updateRequest: UpdateCouponRequest = {
      id: this.selectedCoupon.id,
      ...this.couponForm,
    };

    this.couponService
      .updateCoupon(updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Coupon updated:', response);
          this.closeModals();
          this.loadCoupons();
        },
        error: (error) => {
          this.error = 'Error al actualizar cupón';
          this.isLoading = false;
          console.error('Error updating coupon:', error);
        },
      });
  }

  deleteCoupon(coupon: Coupon): void {
    if (!confirm(`¿Está seguro de eliminar el cupón "${coupon.code}"?`)) {
      return;
    }

    this.isLoading = true;

    this.couponService
      .deleteCoupon(coupon.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Coupon deleted:', response);
          if (response.deactivated) {
            alert('El cupón ha sido desactivado (ya fue usado en reservas)');
          }
          this.loadCoupons();
        },
        error: (error) => {
          this.error = 'Error al eliminar cupón';
          this.isLoading = false;
          console.error('Error deleting coupon:', error);
        },
      });
  }

  toggleCouponStatus(coupon: Coupon): void {
    const updateRequest: UpdateCouponRequest = {
      id: coupon.id,
      isActive: !coupon.isActive,
    };

    this.couponService
      .updateCoupon(updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCoupons();
        },
        error: (error) => {
          console.error('Error toggling coupon status:', error);
        },
      });
  }

  getDiscountDisplay(coupon: Coupon): string {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    }
    return `€${coupon.discountValue.toFixed(2)}`;
  }

  isExpired(coupon: Coupon): boolean {
    if (!coupon.validUntil) return false;
    return new Date(coupon.validUntil) < new Date();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
