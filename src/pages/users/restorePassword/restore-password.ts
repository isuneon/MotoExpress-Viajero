import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../../providers/users/users';
import { PrincipalProvider } from '../../../providers/principal';
import { EmailComposer } from '@ionic-native/email-composer';

import {AngularFireAuth} from 'angularfire2/auth';


@Component({
    selector: 'page-restore-password',
    templateUrl: 'restore-password.html',
})
export class RestorePasswordPage {

    forma: FormGroup;
    codigo: number;
    key: string = "";
   
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider,
                public emailComposer: EmailComposer,
                private afAuth: AngularFireAuth) {

        this.forma = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])]
        });
    }

   

    restorePassword(){
        let loader = this._principalProvider.loading('Enviando contraseña a su correo');
        this._usersProvider.comprobarEmail(this.forma.controls['email']['value']).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                if(this.forma.controls['email']['value'] == actions[0]['payload'].val()['correo']){
                    this.key = actions[0]['key']
                    this.codigo = this._principalProvider.generateCodeRandom();

                    console.log(this.codigo)

                    this.resetPassword(this.forma.controls['email']['value']);

                    // let correo = this.createEmail(this.forma.controls['email']['value'], this.codigo)
                    // this.emailComposer.open(correo);
                }
                // let password = actions[0]['payload'].val()['password']
                // let pwdEncrypt = this._principalProvider.encryptByDES(this.forma.controls['password']['value'])
                // if(password == pwdEncrypt){
                //     let newPwdEncrypt = this._principalProvider.encryptByDES(this.forma.controls['password1']['value']);
                //     this._usersProvider.changePassword(this.key, newPwdEncrypt);
                // }
                // else{
                //     this._principalProvider.showAlert('Error', 'La contraseña actual es incorrecta');
                // }
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar enviar el correo. Verifique el correo que ingreso')
            }
            loader.dismiss();
        });
    }
    
    createEmail(correo, codigo){

        let email = {
            to: correo,
            cc: 'billy_rogers_07@hotmail.com',
            // bcc: ['john@doe.com', 'jane@doe.com'],
            // attachments: [
            //     'file://img/logo.png',
            //     'res://icon.png',
            //     'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
            //     'file://README.pdf'
            // ],
            subject: 'Contraseña nueva',
            body: 'La contraseña nueva es: ' + codigo,
            isHtml: true
        };

        return email
    }

    resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => console.log('sent Password Reset Email!'))
      .catch((error) => console.log(error))
  }
}
