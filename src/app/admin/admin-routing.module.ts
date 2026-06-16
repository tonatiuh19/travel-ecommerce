import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminTripsComponent } from './trips/admin-trips.component';
import { AdminCouponsComponent } from './coupons/admin-coupons.component';
import { AdminVisitorsComponent } from './visitors/admin-visitors.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent,
  },
  {
    path: 'trips',
    component: AdminTripsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'coupons',
    component: AdminCouponsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'visitors',
    component: AdminVisitorsComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: '',
    redirectTo: 'trips',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
