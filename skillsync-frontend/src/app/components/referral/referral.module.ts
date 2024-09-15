import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ReferralComponent } from './referral.component';

@NgModule({
  declarations: [ReferralComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [ReferralComponent]
})
export class ReferralModule { }