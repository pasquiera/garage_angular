import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';


import { AppComponent } from './app.component';
import { CarListComponent } from './cars/car-list/car-list.component';
import { CountDownComponent } from './shared/count-down/count-down.component';
import { CarDetailComponent } from './cars/car-detail/car-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { environment } from 'src/environments/environment';
import { AuthenticatorComponent } from './authenticator/authenticator.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ProfileComponent } from './profile/profile.component';




registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    CarListComponent,
    CountDownComponent,
    CarDetailComponent,
    AuthenticatorComponent,
    EmailVerificationComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule, //permet de faire fonctionner l'application dans le navigateur
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'auctions', component: CarListComponent },
      { path: '', redirectTo: 'auctions', pathMatch: 'full' },
      { path: "emailVerification", component: EmailVerificationComponent },
      { path: 'car/:id', component: CarDetailComponent },
      { path: '**', redirectTo: 'auctions', pathMatch: 'full' },
    ], { scrollPositionRestoration: 'enabled' }),
    MatDialogModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    FirebaseTSApp.init(environment.firebaseConfig); // link firebase to the project
  }
}
