import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MobileEnhancedHeroComponent } from './mobile-enhanced-hero.component';

@NgModule({
  declarations: [MobileEnhancedHeroComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [MobileEnhancedHeroComponent],
})
export class MobileEnhancedHeroModule {}
