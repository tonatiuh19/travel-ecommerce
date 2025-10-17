import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { vanTransferReducer } from './reducers/van-transfer.reducer';
import { VanTransferEffects } from './effects/van-transfer.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('vanTransfer', vanTransferReducer),
    EffectsModule.forFeature([VanTransferEffects]),
  ],
})
export class VanTransferStoreModule {}
