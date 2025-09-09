import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnhancedFooterComponent } from './enhanced-footer.component';

@NgModule({
  declarations: [EnhancedFooterComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [EnhancedFooterComponent],
})
export class EnhancedFooterModule {}
