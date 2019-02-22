import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelInfoPage } from './travel-info';

@NgModule({
  declarations: [
    TravelInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelInfoPage),
  ],
})
export class TravelInfoPageModule {}
