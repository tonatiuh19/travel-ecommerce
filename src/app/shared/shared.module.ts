import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LogoComponent } from './components/logo/logo.component';
import { ThankYouModule } from './components/thank-you/thank-you.module';
import { LoadingMaskComponent } from './components/loading-mask/loading-mask.component';
import { PhoneInputPickerModule } from './components/phone-input-picker/phone-input-picker.module';
import { MetaService } from './services/meta.service';

@NgModule({
  declarations: [LogoComponent, LoadingMaskComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ThankYouModule,
    PhoneInputPickerModule,
  ],
  exports: [
    LogoComponent,
    ThankYouModule,
    LoadingMaskComponent,
    PhoneInputPickerModule,
  ],
  providers: [MetaService],
})
export class SharedModule {}
