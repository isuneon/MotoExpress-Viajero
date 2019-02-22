import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../../providers/users/users';
import { PrincipalProvider } from '../../../providers/principal';
import * as moment from 'moment';


@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

    forma : FormGroup;
    key:string = "";
    anio: string;
   
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider) {

        // this.anio = new Date().getFullYear();
        this.anio = moment().format('YYYY')
        this.forma = this.formBuilder.group({
            password: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            password1: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            password2: []
        });

        this.forma.controls['password2'].setValidators([Validators.required, this.noIgual.bind(this.forma)])
    }

    /*updatePassword(){
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
    }*/

/*---------------------------------------------------------------------------------------------------------------------------------------*/

    updatePassword(){
        let loader = this._principalProvider.loading('Actualizando contraseña');
        let pwdEncryptOld = this._principalProvider.encryptByDES(this.forma.controls['password']['value'])
        let pwdEncryptNew = this._principalProvider.encryptByDES(this.forma.controls['password1']['value'])
        this._usersProvider.changePassword(localStorage.getItem("id"), pwdEncryptOld, pwdEncryptNew).subscribe(res => {
            if(res['status'] == "200"){
                this._principalProvider.showAlert('Éxito', 'Contraseña actualizada exitosamente');
            }else{
                this._principalProvider.showAlert('Error', res['error'])
            }
            loader.dismiss();
        },
        error => {
            console.log(error)
        });
    }


    noIgual(control: FormBuilder): any {
        if(control['value'] !== this['controls']['password1'].value){
            return {
                noIguales:true
            }
        }
        return null;
    }
    
}
