import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AuthenticatorComponent } from './accounts/authenticator/authenticator.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EmailVerificationComponent } from './accounts/email-verification/email-verification.component';
import { ProfileSettingComponent } from './accounts/profile-setting/profile-setting.component';
import { FileUploadComponent } from './accounts/file-upload/file-upload.component';
import { CarCreateComponent } from './cars/car-create/car-create.component';

import { DragDropModule } from '@angular/cdk/drag-drop';



registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    CarListComponent,
    CountDownComponent,
    CarDetailComponent,
    CarCreateComponent,
    AuthenticatorComponent,
    EmailVerificationComponent,
    ProfileSettingComponent,
    FileUploadComponent,
  ],
  imports: [
    BrowserModule, //permet de faire fonctionner l'application dans le navigateur
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'auctions', component: CarListComponent },
      { path: '', redirectTo: 'auctions', pathMatch: 'full' },
      { path: 'settings', component: ProfileSettingComponent},
      { path: 'create', component: CarCreateComponent},
      { path: "emailVerification", component: EmailVerificationComponent },
      { path: 'car/:id', component: CarDetailComponent },
      { path: '**', redirectTo: 'auctions', pathMatch: 'full' },
    ], { scrollPositionRestoration: 'enabled' }),
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase), // link firebase to the project
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {

  }
}
