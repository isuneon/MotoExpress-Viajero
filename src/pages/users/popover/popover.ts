import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { ChangePasswordPage } from '../changePassword/change-password';


@Component({
	selector: 'popover',
    templateUrl: 'popover.html',
})
export class PopoverPage {
  
	constructor(public viewCtrl: ViewController,
				public navCtrl: NavController) {

	}


	viewForm() {
		this.navCtrl.push(ChangePasswordPage);
		this.viewCtrl.dismiss();
	}
}