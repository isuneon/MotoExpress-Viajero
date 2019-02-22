import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelerDetailsPage } from './traveler-details';

@NgModule({
  declarations: [
    TravelerDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelerDetailsPage),
  ],
})
export class DriversDetailsPageModule {}
