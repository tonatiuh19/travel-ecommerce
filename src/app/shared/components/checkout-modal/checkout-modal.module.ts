import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutModalComponent } from './checkout-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThankYouModule } from '../thank-you/thank-you.module';
import { SharedModule } from '../../shared.module';
import { PhoneInputPickerModule } from '../phone-input-picker/phone-input-picker.module';

@NgModule({
  declarations: [CheckoutModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ThankYouModule,
    SharedModule,
    PhoneInputPickerModule,
  ],
  exports: [CheckoutModalComponent],
})
export class CheckoutModalModule {}
