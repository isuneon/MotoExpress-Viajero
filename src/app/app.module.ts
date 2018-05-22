import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmailComposer } from '@ionic-native/email-composer';

/* Components */
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CreateUserPage } from '../pages/users/createUser/create-user';
import { DataUserPage } from '../pages/users/createUser/data-user';
import { EditUserPage } from '../pages/users/editUser/edit-user';
import { ChangePasswordPage } from '../pages/users/changePassword/change-password';
import { RestorePasswordPage } from '../pages/users/restorePassword/restore-password';
import { PopoverPage } from '../pages/users/popover/popover';

/* Providers */
import { UsersProvider } from '../providers/users/users';
import { PrincipalProvider } from '../providers/principal';

import { Geolocation } from '@ionic-native/geolocation';


export const firebaseConfig = {
    apiKey: "AIzaSyCwIF1HrXjwQmvgoS2UagFQ7e71GzoZk-A",
    authDomain: "serviceapp-996b8.firebaseapp.com",
    databaseURL: "https://serviceapp-996b8.firebaseio.com",
    projectId: "serviceapp-996b8",
    storageBucket: "gs://serviceapp-996b8.appspot.com",
    messagingSenderId: "716376033487"
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        CreateUserPage,
        DataUserPage,
        EditUserPage,
        ChangePasswordPage,
        RestorePasswordPage,
        PopoverPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
          monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          monthShortNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        }),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireStorageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        CreateUserPage,
        DataUserPage,
        EditUserPage,
        ChangePasswordPage,
        RestorePasswordPage,
        PopoverPage
    ],
    providers: [
        StatusBar,
        Geolocation,
        SplashScreen,
        EmailComposer,
        AngularFireDatabase,
        UsersProvider,
        PrincipalProvider,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    ]
})
export class AppModule {}
