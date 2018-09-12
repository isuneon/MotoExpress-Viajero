import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-drivers-details',
  templateUrl: 'drivers-details.html',
})
export class DriversDetailsPage {

	data:any;

	constructor(public navCtrl: NavController,
		  		public navParams: NavParams) {

		this.data = navParams.get("data");
		console.log(this.data)
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriversDetailsPage');
  }

}
