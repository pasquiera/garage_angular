import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorComponent } from './accounts/authenticator/authenticator.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations'
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from './user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fader,
  ]
})
export class AppComponent {
  title: string = "Garage Automobile";
  userHasProfile = true;
  user: IUser;

  constructor(private dialog: MatDialog,
    private router: Router, public auth: AuthService
  ) {

    /* this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
            },
            whenSignedOut: user => {
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"]);
              this.getUserProfile();
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            },
            whenChanged: user => {
            }
          }
        );
      }
    ); */
  }

  getUserProfile() {
    /* this.firestore.listenToDocument(
      {
        name: "Getting Document",
        path: ["Users", this.auth.getAuth().currentUser!.uid],
        onUpdate: (result) => {
          this.userDocument = <IUserDocument>result.data();
          this.userHasProfile = result.exists;
        }
      }
    ); */
  }

  onLoginClick() {
    this.dialog.open(AuthenticatorComponent)
  }

  onLogoutClick() {
    this.auth.signOut().then(res => {
      /* this.firestore.stopListeningToAll();
      this.user.userName = ""; */
      this.auth.setLoginState(false);
      this.router.navigate(["auctions"]);
    });
  }

  loggedIn() {
    return this.auth.isLoggedIn;
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) return outlet.activatedRoute.snapshot.url
    return '';
  }

}
