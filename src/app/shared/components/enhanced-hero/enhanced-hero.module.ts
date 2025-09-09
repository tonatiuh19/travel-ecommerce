import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnhancedHeroComponent } from './enhanced-hero.component';

@NgModule({
  declarations: [EnhancedHeroComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [EnhancedHeroComponent],
})
export class EnhancedHeroModule {}
