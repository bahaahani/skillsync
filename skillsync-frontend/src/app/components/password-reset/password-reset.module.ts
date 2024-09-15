import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared/shared.module';
import { PasswordResetComponent } from './password-reset.component';

@NgModule({
  declarations: [PasswordResetComponent],
  imports: [SharedModule],
  exports: [PasswordResetComponent]
})
export class PasswordResetModule { }