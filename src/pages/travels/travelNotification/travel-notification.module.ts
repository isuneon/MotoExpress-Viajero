import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelNotificationPage } from './travel-notification';

@NgModule({
  declarations: [
    TravelNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelNotificationPage),
  ],
})
export class TravelQualificationPageModule {}
