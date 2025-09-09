import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutModalComponent } from './checkout-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CheckoutModalComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [CheckoutModalComponent],
})
export class CheckoutModalModule {}
