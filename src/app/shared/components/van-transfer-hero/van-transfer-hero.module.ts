import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VanTransferHeroComponent } from './van-transfer-hero.component';
import { CheckoutModalModule } from '../checkout-modal/checkout-modal.module';

@NgModule({
  declarations: [VanTransferHeroComponent],
  imports: [CommonModule, FormsModule, CheckoutModalModule],
  exports: [VanTransferHeroComponent],
})
export class VanTransferHeroModule {}
