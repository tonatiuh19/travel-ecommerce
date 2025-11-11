import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PackageComponent } from './package/package.component';
import { TermsAndConditionsComponent } from './shared/components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyTermsComponent } from './shared/components/privacy-terms/privacy-terms.component';
import { ThankYouComponent } from './shared/components/thank-you/thank-you.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'paquete',
    component: PackageComponent,
  },
  {
    path: 'reserva',
    loadChildren: () =>
      import('./reservation/reservation.module').then(
        (m) => m.ReservationModule
      ),
  },
  {
    path: 'van-transfer-checkout',
    loadChildren: () =>
      import(
        './shared/components/van-transfer-checkout/van-transfer-checkout.module'
      ).then((m) => m.VanTransferCheckoutModule),
    data: {
      title: 'Finalizar Reserva - Transfer VIP',
      description: 'Complete su reserva de transfer desde París',
    },
  },
  {
    path: 'van-transfer-checkout/:bookingData',
    loadChildren: () =>
      import(
        './shared/components/van-transfer-checkout/van-transfer-checkout.module'
      ).then((m) => m.VanTransferCheckoutModule),
    data: {
      title: 'Finalizar Reserva - Transfer VIP',
      description: 'Complete su reserva de transfer desde París',
    },
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    data: {
      title: 'Términos y Condiciones',
      description: 'Consulta nuestros términos y condiciones de uso',
    },
  },
  {
    path: 'privacy-terms',
    component: PrivacyTermsComponent,
    data: {
      title: 'Política de Privacidad',
      description: 'Conoce cómo protegemos tu privacidad y datos personales',
    },
  },
  {
    path: 'thank-you',
    component: ThankYouComponent,
    data: {
      title: 'Reserva Confirmada',
      description: 'Su reserva ha sido procesada exitosamente',
    },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    data: {
      title: 'Admin Panel',
      description: 'Manage trips and bookings',
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
