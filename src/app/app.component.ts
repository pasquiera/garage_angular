import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorComponent } from './accounts/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations'
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

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
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  userDocument: UserDocument;

  constructor(private dialog: MatDialog,
    private router: Router) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
            },
            whenSignedOut: user => {
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"]);
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            },
            whenChanged: user => {
            }
          }
        );
      }
    );
  }

  getUserProfile() {
    this.firestore.listenToDocument(
      {
        name: "Getting Document",
        path: ["Users", this.auth.getAuth().currentUser!.uid],
        onUpdate: (result) => {
          this.userDocument = <UserDocument>result.data();
          this.userHasProfile = result.exists;
        }
      }
    );
  }

  onLoginClick() {
    this.dialog.open(AuthenticatorComponent)
  }

  onLogoutClick() {
    this.auth.signOut();
    this.firestore.stopListeningToAll();
    this.userDocument.publicName = "";
    this.userDocument.description = "";
  }

  loggedIn() {
    return this.auth.isSignedIn();
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) return outlet.activatedRoute.snapshot.url
    return '';
  }

}

export interface UserDocument {
  publicName: string; // match de name of the property on the database
  description: string;

}
