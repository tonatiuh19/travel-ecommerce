import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PackageComponent } from './package/package.component';
import { TermsAndConditionsComponent } from './shared/components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyTermsComponent } from './shared/components/privacy-terms/privacy-terms.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
