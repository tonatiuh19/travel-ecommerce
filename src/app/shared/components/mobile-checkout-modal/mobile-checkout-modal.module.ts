import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MobileCheckoutModalComponent } from './mobile-checkout-modal.component';

@NgModule({
  declarations: [MobileCheckoutModalComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [MobileCheckoutModalComponent],
})
export class MobileCheckoutModalModule {}
