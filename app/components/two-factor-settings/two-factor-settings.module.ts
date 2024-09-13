import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TwoFactorSettingsComponent } from './two-factor-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: TwoFactorSettingsComponent }
];

@NgModule({
  declarations: [TwoFactorSettingsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class TwoFactorSettingsModule { }