import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CountryPickerComponent } from './country-picker.component';

@NgModule({
  declarations: [CountryPickerComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [CountryPickerComponent],
})
export class CountryPickerModule {}
