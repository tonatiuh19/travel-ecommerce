import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VanTransferCardComponent } from './van-transfer-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [VanTransferCardComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [VanTransferCardComponent],
})
export class VanTransferCardModule {}
