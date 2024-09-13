import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PasswordResetComponent } from './password-reset.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PasswordResetComponent }
];

@NgModule({
  declarations: [PasswordResetComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PasswordResetModule { }