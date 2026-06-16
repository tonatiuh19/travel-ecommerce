import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminTripsStoreModule } from './store/admin-trips.store.module';
import { AdminVisitorsStoreModule } from './store/admin-visitors.store.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminTripsComponent } from './trips/admin-trips.component';
import { TripWizardComponent } from './components/trip-wizard/trip-wizard.component';
import { TripEditModalComponent } from './components/trip-edit-modal/trip-edit-modal.component';
import { AdminCouponsComponent } from './coupons/admin-coupons.component';
import { AdminVisitorsComponent } from './visitors/admin-visitors.component';

// Services
import { AdminAuthService } from './services/admin-auth.service';
import { AdminTripsService } from './services/admin-trips.service';
import { AdminVisitorsService } from './services/admin-visitors.service';

// Guards
import { AdminAuthGuard } from './guards/admin-auth.guard';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminTripsComponent,
    TripWizardComponent,
    TripEditModalComponent,
    AdminCouponsComponent,
    AdminVisitorsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    AdminRoutingModule,
    AdminTripsStoreModule,
    AdminVisitorsStoreModule,
    SharedModule,
  ],
  providers: [
    AdminAuthService,
    AdminTripsService,
    AdminVisitorsService,
    AdminAuthGuard,
  ],
})
export class AdminModule {}
