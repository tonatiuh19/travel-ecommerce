import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { HeaderModule } from '../shared/components/header/header.module';
import { FooterModule } from '../shared/components/footer/footer.module';
import { ReviewCardModule } from '../shared/components/review-card/review-card.module';
import { PackageCardModule } from '../shared/components/package-card/package-card.module';
import { PlaceCardModule } from '../shared/components/place-card/place-card.module';
import { PackageImageCardModule } from '../shared/components/package-image-card/package-image-card.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    ReviewCardModule,
    PackageCardModule,
    PlaceCardModule,
    PackageImageCardModule,
  ],
  exports: [LandingComponent],
})
export class LandingModule {}
