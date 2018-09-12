import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriversDetailsPage } from './drivers-details';

@NgModule({
  declarations: [
    DriversDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DriversDetailsPage),
  ],
})
export class DriversDetailsPageModule {}
