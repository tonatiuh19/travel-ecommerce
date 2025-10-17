import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VanTransferHeroComponent } from './van-transfer-hero.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [VanTransferHeroComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, SharedModule],
  exports: [VanTransferHeroComponent],
})
export class VanTransferHeroModule {}
