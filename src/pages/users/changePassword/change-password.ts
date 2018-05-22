import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../../providers/users/users';
import { PrincipalProvider } from '../../../providers/principal';


@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

    forma : FormGroup;
    key:string = "";
   
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider) {

        this.forma = this.formBuilder.group({
            password: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            password1: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            password2: []
        });

        this.forma.controls['password2'].setValidators([Validators.required, this.noIgual.bind(this.forma)])
    }

    noIgual(control: FormBuilder): any {
        if(control['value'] !== this['controls']['password1'].value){
            return {
                noIguales:true
            }
        }
        return null;
    }

    updatePassword(){
        let loader = this._principalProvider.loading('Actualizando contraseña');
        this._usersProvider.comprobarEmail(localStorage.getItem("email")).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                let password = actions[0]['payload'].val()['password']
                this.key = actions[0]['key']
                let pwdEncrypt = this._principalProvider.encryptByDES(this.forma.controls['password']['value'])
                if(password == pwdEncrypt){
                    let newPwdEncrypt = this._principalProvider.encryptByDES(this.forma.controls['password1']['value']);
                    this._usersProvider.changePassword(this.key, newPwdEncrypt);
                }
                // else{
                //     this._principalProvider.showAlert('Error', 'La contraseña actual es incorrecta');
                // }
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar consultar la información del usuario')
            }
            loader.dismiss();
        });
    }
    
}
