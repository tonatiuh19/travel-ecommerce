import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { adminTripsReducer } from './reducers/admin-trips.reducer';
import { AdminTripsEffects } from './effects/admin-trips.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('adminTrips', adminTripsReducer),
    EffectsModule.forFeature([AdminTripsEffects]),
  ],
})
export class AdminTripsStoreModule {}
