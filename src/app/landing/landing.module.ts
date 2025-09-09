import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { HeaderModule } from '../shared/components/header/header.module';
import { FooterModule } from '../shared/components/footer/footer.module';
import { PlaceCardModule } from '../shared/components/place-card/place-card.module';
import { LandingStoreModule } from './store/landing.store.module';
import { VanTransferHeroModule } from '../shared/components/van-transfer-hero/van-transfer-hero.module';
import { VanTransferCardModule } from '../shared/components/van-transfer-card/van-transfer-card.module';
import { VideoInfoSectionModule } from '../shared/components/video-info-section/video-info-section.module';
import { DestinationsShowcaseModule } from '../shared/components/destinations-showcase/destinations-showcase.module';
import { EnhancedHeroModule } from '../shared/components/enhanced-hero/enhanced-hero.module';
import { EnhancedFooterModule } from '../shared/components/enhanced-footer/enhanced-footer.module';
import { MobileEnhancedHeroModule } from '../shared/components/mobile-enhanced-hero/mobile-enhanced-hero.module';
import { MobileVanTransferHeroModule } from '../shared/components/mobile-van-transfer-hero/mobile-van-transfer-hero.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    PlaceCardModule,
    LandingStoreModule,
    VanTransferHeroModule,
    VanTransferCardModule,
    VideoInfoSectionModule,
    DestinationsShowcaseModule,
    EnhancedHeroModule,
    EnhancedFooterModule,
    MobileEnhancedHeroModule,
    MobileVanTransferHeroModule,
    FontAwesomeModule,
  ],
  exports: [LandingComponent],
})
export class LandingModule {}
