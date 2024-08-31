import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PackageComponent } from './package/package.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'paquete',
    component: PackageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
