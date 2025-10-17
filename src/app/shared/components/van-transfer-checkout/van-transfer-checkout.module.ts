import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { VanTransferCheckoutComponent } from './van-transfer-checkout.component';
import { CountryPickerModule } from '../country-picker/country-picker.module';
import { PhoneInputPickerModule } from '../phone-input-picker/phone-input-picker.module';

@NgModule({
  declarations: [VanTransferCheckoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: VanTransferCheckoutComponent,
      },
    ]),
    FontAwesomeModule,
    StoreModule,
    CountryPickerModule,
    PhoneInputPickerModule,
  ],
  exports: [VanTransferCheckoutComponent],
})
export class VanTransferCheckoutModule {}
