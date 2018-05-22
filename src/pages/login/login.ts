import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController  } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CreateUserPage } from '../users/createUser/create-user';
import { RestorePasswordPage } from '../users/restorePassword/restore-password';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
import { PrincipalProvider } from '../../providers/principal';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    forma : FormGroup;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider,
                private afAuth: AngularFireAuth) {

        this.forma = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])],
            password: ['', Validators.required],
        });
    
    }

    inicioSesion(){
        let loader = this._principalProvider.loading('Iniciando sesión');
        this._usersProvider.comprobarEmail(this.forma.controls['email'].value).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                let data = actions[0]['payload'].val()
                let pwdEncrypt = this._principalProvider.encryptByDES(this.forma.controls['password']['value'])
                if(data['correo'] == this.forma.controls['email'].value && data['password'] == pwdEncrypt){
                       if(data['type_acount'] == 'driver' && data['autorizado'] == false){
                           this._principalProvider.showAlert('Error', 'Su cuenta aun no esta autorizada para utilizar la app');
                       }else{
                            localStorage.setItem("email", data['correo']);
                            localStorage.setItem("type_acount", data['type_acount']);
                            localStorage.setItem("user", data['nombre']);
                            localStorage.setItem("procedencia", 'correo');
                            this.navCtrl.setRoot(HomePage)
                       }
                }else{
                    this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.');
                }
            }else{
                this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.');
            }
            loader.dismiss();
        });
    }

    recuperarContrasena(){
        this.navCtrl.push(RestorePasswordPage)
    }

    nuevoUsuario(){
        this.navCtrl.push(CreateUserPage)
    }

    inicioSesionFacebook() {
        let loader = this._principalProvider.loading('Iniciando sesión con Facebook');
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }
        });
    }

    inicioSesionGoogle() {
        let loader = this._principalProvider.loading('Iniciando sesión con Google');
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }
        });
    } 

    validarCuentaUsuario(info, loader, redSocial){
        this._usersProvider.comprobarEmail(info['user']['email']).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                let data = actions[0]['payload'].val()
                localStorage.setItem("email", data['correo']);
                localStorage.setItem("type_acount", data['type_acount']);
                localStorage.setItem("user", data['nombre']);
                localStorage.setItem("procedencia", redSocial);
                this.navCtrl.setRoot(HomePage)
            }else{
                this.navCtrl.push(CreateUserPage, {data: info});
            }
            loader.dismiss();
        });

    }
    
    // signOut() {
    //     this.afAuth.auth.signOut();
    // }

    // logout() {
    //     this.afAuth.auth.signOut();
    // }

}
