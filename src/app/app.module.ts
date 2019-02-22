import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EmailComposer } from '@ionic-native/email-composer';
import { Geolocation } from '@ionic-native/geolocation';


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
import { TravelDetailsPage } from '../pages/travels/travelDetails/travel-details';
import { DriversDetailsPage } from '../pages/travels/driversDetails/drivers-details';
import { TravelInfoPage } from '../pages/travels/travelInfo/travel-info';
import { PopoverTravelPage } from '../pages/travels/popoverTravel/popover-travel';
import { TravelQualificationPage } from '../pages/travels/travelQualification/travel-qualification';
import { TravelNotificationPage } from '../pages/travels/travelNotification/travel-notification';
import { TravelerDetailsPage } from '../pages/travels/travelerDetails/traveler-details';


/* Providers */
import { UsersProvider } from '../providers/users/users';
import { RatesProvider } from '../providers/rates/rates';
import { TravelsProvider } from '../providers/travels/travels';
import { PreferStorage } from '../providers/preferStorage';
import { PrincipalProvider } from '../providers/principal';


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
        PopoverPage,
        PopoverTravelPage,
        TravelDetailsPage,
        TravelInfoPage,
        DriversDetailsPage,
        TravelQualificationPage,
        TravelNotificationPage,
        TravelerDetailsPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
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
        PopoverPage,
        PopoverTravelPage,
        TravelDetailsPage,
        TravelInfoPage,
        DriversDetailsPage,
        TravelQualificationPage,
        TravelNotificationPage,
        TravelerDetailsPage
    ],
    providers: [
        StatusBar,
        Geolocation,
        SplashScreen,
        EmailComposer,
        AngularFireDatabase,
        UsersProvider,
        RatesProvider,
        TravelsProvider,
        PreferStorage,
        PrincipalProvider,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
    ]
})
export class AppModule {}
