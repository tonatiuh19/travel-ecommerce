import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MobileCheckoutModalComponent } from './mobile-checkout-modal.component';
import { ThankYouModule } from '../thank-you/thank-you.module';

@NgModule({
  declarations: [MobileCheckoutModalComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ThankYouModule],
  exports: [MobileCheckoutModalComponent],
})
export class MobileCheckoutModalModule {}
