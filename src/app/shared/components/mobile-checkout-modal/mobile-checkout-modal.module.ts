import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MobileCheckoutModalComponent } from './mobile-checkout-modal.component';
import { ThankYouModule } from '../thank-you/thank-you.module';
import { PhoneInputPickerModule } from '../phone-input-picker/phone-input-picker.module';

@NgModule({
  declarations: [MobileCheckoutModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ThankYouModule,
    PhoneInputPickerModule,
  ],
  exports: [MobileCheckoutModalComponent],
})
export class MobileCheckoutModalModule {}
