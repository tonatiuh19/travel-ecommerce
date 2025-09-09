import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnhancedPackageCardComponent } from './enhanced-package-card.component';

@NgModule({
  declarations: [EnhancedPackageCardComponent],
  imports: [CommonModule],
  exports: [EnhancedPackageCardComponent],
})
export class EnhancedPackageCardModule {}
