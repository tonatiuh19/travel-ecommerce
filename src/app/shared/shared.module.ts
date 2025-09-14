import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LogoComponent } from './components/logo/logo.component';
import { ThankYouModule } from './components/thank-you/thank-you.module';
import { LoadingMaskComponent } from './components/loading-mask/loading-mask.component';

@NgModule({
  declarations: [LogoComponent, LoadingMaskComponent],
  imports: [CommonModule, FontAwesomeModule, ThankYouModule],
  exports: [LogoComponent, ThankYouModule, LoadingMaskComponent],
})
export class SharedModule {}
