import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
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
  ) {

    this.auth.initialize().subscribe(val => {
      if (val) {
        console.log(val);
        this.displayUserName();
      }
    })

  }

  displayUserName() {
    this.subscription = this.auth.getUserData().subscribe(user => {
      this.userName = user.userName;
    })

  }

  onLoginClick() {
    this.dialog.open(AuthenticatorComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      panelClass: 'custom-modalbox'
    })
  }

  onLogoutClick() {
    this.router.navigate(["auctions"]);
    this.auth.signOut();
    this.subscription.unsubscribe();
    this.userName = '';
  }

  loggedIn() {
    return this.auth.isLoggedIn;
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) return outlet.activatedRoute.snapshot.url
    return '';
  }

}
