import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ThankYouComponent } from './thank-you.component';

@NgModule({
  declarations: [ThankYouComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [ThankYouComponent],
})
export class ThankYouModule {}
