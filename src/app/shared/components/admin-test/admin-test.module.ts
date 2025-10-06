import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AdminTestComponent } from './admin-test.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTestComponent,
  },
];

@NgModule({
  declarations: [AdminTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes),
  ],
})
export class AdminTestModule {}
