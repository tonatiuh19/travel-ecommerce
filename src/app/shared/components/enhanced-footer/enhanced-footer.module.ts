import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnhancedFooterComponent } from './enhanced-footer.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [EnhancedFooterComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, SharedModule],
  exports: [EnhancedFooterComponent],
})
export class EnhancedFooterModule {}
