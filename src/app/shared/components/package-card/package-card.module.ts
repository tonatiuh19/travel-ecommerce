import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageCardComponent } from './package-card.component';

@NgModule({
  declarations: [PackageCardComponent],
  imports: [CommonModule],
  exports: [PackageCardComponent],
})
export class PackageCardModule {}
