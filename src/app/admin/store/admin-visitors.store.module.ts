import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { adminVisitorsReducer } from './reducers/admin-visitors.reducer';
import { AdminVisitorsEffects } from './effects/admin-visitors.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('adminVisitors', adminVisitorsReducer),
    EffectsModule.forFeature([AdminVisitorsEffects]),
  ],
})
export class AdminVisitorsStoreModule {}
