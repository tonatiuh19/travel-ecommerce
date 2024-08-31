import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageComponent } from './package.component';
import { HeaderModule } from '../shared/components/header/header.module';
import { FooterModule } from '../shared/components/footer/footer.module';

@NgModule({
  declarations: [PackageComponent],
  imports: [CommonModule, HeaderModule, FooterModule],
  exports: [PackageComponent],
})
export class PackageModule {}
