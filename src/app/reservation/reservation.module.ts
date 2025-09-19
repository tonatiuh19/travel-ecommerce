import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservationComponent } from './reservation.component';

@NgModule({
  declarations: [ReservationComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ReservationComponent }]),
  ],
  exports: [ReservationComponent],
})
export class ReservationModule {}
