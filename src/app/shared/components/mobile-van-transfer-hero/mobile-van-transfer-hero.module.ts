import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MobileVanTransferHeroComponent } from './mobile-van-transfer-hero.component';
import { MobileCheckoutModalModule } from '../mobile-checkout-modal/mobile-checkout-modal.module';

@NgModule({
  declarations: [MobileVanTransferHeroComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MobileCheckoutModalModule,
  ],
  exports: [MobileVanTransferHeroComponent],
})
export class MobileVanTransferHeroModule {}
