import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PhoneInputPickerComponent } from './phone-input-picker.component';

@NgModule({
  declarations: [PhoneInputPickerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  exports: [PhoneInputPickerComponent],
})
export class PhoneInputPickerModule {}
