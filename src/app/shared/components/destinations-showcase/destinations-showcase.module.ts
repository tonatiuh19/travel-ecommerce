import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationsShowcaseComponent } from './destinations-showcase.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [DestinationsShowcaseComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [DestinationsShowcaseComponent],
})
export class DestinationsShowcaseModule {}
