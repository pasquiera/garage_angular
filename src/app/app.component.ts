import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorComponent } from './accounts/authenticator/authenticator.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations'
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
  userName: string;
  subscription: any;

  constructor(private dialog: MatDialog,
    private router: Router,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
  ) {

    this.afAuth.onAuthStateChanged(user => {
      //var user = firebase.auth().currentUser;
      if (user) {
        this.auth.userID = user.uid;
        this.displayUserName();
      } else {
        setInterval(() => {
          console.log(this.auth.userID);
        }, 1000)
      }

    });

  }

  displayUserName() {
    this.subscription = this.auth.getUserData().subscribe(user => {
      this.userName = user.userName;
    })

  }

  onLoginClick() {
    this.dialog.open(AuthenticatorComponent)
  }

  onLogoutClick() {
    this.auth.signOut();
    this.subscription.unsubscribe();
    this.userName = '';
    this.router.navigate(["auctions"]);
  }

  loggedIn() {
    return this.auth.isLoggedIn;
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) return outlet.activatedRoute.snapshot.url
    return '';
  }

}
