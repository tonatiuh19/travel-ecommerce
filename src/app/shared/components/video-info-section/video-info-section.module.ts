import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoInfoSectionComponent } from './video-info-section.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [VideoInfoSectionComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [VideoInfoSectionComponent],
})
export class VideoInfoSectionModule {}
