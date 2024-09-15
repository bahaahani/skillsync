import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NavBarComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    NavBarComponent,
    NotificationsComponent,
  ]
})
export class LayoutModule { }