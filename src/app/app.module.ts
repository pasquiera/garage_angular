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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EmailVerificationComponent } from './accounts/email-verification/email-verification.component';
import { ProfileSettingComponent } from './accounts/profile-setting/profile-setting.component';
import { FileUploadComponent } from './accounts/file-upload/file-upload.component';
import { CarEditComponent } from './cars/car-edit/car-edit.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CarouselDialogComponent } from './cars/upload-box/carousel-dialog/carousel-dialog.component';
import { UploadBoxComponent } from './cars/upload-box/upload-box/upload-box.component';
import { CommentSectionComponent } from './shared/comment-section/comment-section.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './accounts/image-cropper/image-cropper.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BarLoadingComponent } from './shared/bar-loading/bar-loading.component';
import { FaqComponent } from './faq/faq.component';
import { UserBidComponent } from './accounts/user-bid/user-bid.component';
import { AuthGuard } from './services/auth.guard';
import { CarGuard } from './services/car.guard';
import { AlertComponent } from './shared/alert/alert.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    CarListComponent,
    CountDownComponent,
    CarDetailComponent,
    CarEditComponent,
    AuthenticatorComponent,
    EmailVerificationComponent,
    ProfileSettingComponent,
    FileUploadComponent,
    CarouselDialogComponent,
    UploadBoxComponent,
    CommentSectionComponent,
    ImageCropperComponent,
    BarLoadingComponent,
    FaqComponent,
    UserBidComponent,
    AlertComponent,
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
      { path: 'settings', component: ProfileSettingComponent, canActivate: [AuthGuard]},
      { path: 'bid', component: UserBidComponent, canActivate: [AuthGuard]},
      { path: 'create', component: CarEditComponent},
      { path: 'edit/:id', component: CarEditComponent, canActivate: [CarGuard]},
      { path: "emailVerification", component: EmailVerificationComponent, canActivate: [AuthGuard] },
      { path: 'car/:id', component: CarDetailComponent },
      { path: 'faq', component: FaqComponent },
      { path: '**', redirectTo: 'auctions', pathMatch: 'full' },
    ], { scrollPositionRestoration: 'enabled' }),
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    DragDropModule,
    ImageCropperModule,
    AngularFireModule.initializeApp(environment.firebase), // link firebase to the project
    InfiniteScrollModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {

  }
}
