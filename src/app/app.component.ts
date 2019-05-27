import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { EditUserPage } from '../pages/users/editUser/edit-user';
import { PrincipalProvider } from '../providers/principal';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any;


    constructor(public platform: Platform, 
                public statusBar: StatusBar,
                public loadingCtrl: LoadingController,
                public splashScreen: SplashScreen,
                public _principalProvider: PrincipalProvider,
                private afAuth: AngularFireAuth) {
        this.initializeApp();

        if(localStorage.getItem("type_acount")){
            this.rootPage = HomePage;
        }else{
            this.rootPage = LoginPage;
        }

    }


    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.hideSplashScreen();
            this.statusBar.styleDefault();
            // this.splashScreen.hide();
        });
    }


    hideSplashScreen() {
        if (this.splashScreen) {
            setTimeout(() => {
                this.splashScreen.hide();
            }, 100);
        }
    }


    cerrarSesion(){
        this.loading('Cerrando sesión');
        if(localStorage.getItem("procedencia") != 'correo'){
            this.afAuth.auth.signOut();
        }
        localStorage.removeItem("email");
        localStorage.removeItem("type_acount");
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        localStorage.removeItem("procedencia");
        localStorage.removeItem("status");
        localStorage.removeItem("country");
        this.nav.setRoot(LoginPage)
    }


    loading(texto) {
        let loader = this.loadingCtrl.create({
            content: texto,
            duration: 1500
        });
        loader.present();
    }


    verPerfil(){
        this.nav.push(EditUserPage);
    }
}
