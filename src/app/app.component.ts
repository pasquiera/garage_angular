import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AuthenticatorComponent } from './accounts/authenticator/authenticator.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations'
import { AuthService } from './services/auth.service';
import { UtilityService } from './services/utility.service';
import { TestBed } from '@angular/core/testing';

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
  userImg: string;
  subscription: any;
  mobileActiveLink = 'auction_m';

  constructor(private dialog: MatDialog,
    private router: Router,
    public auth: AuthService,
    public utility: UtilityService,
  ) {

    this.auth.initialize().subscribe(val => {
      if (val) {

        this.subscription = this.auth.getUserData().subscribe(user => {

          this.auth.getUserImage(user.imageProfile).then(val => {
            this.userImg = val;
            this.utility.updateData(val);
          })

        })

      } else {
        this.utility.updateData("assets/img/the-interior.jpg");
      }
    })

  }


  onLoginClick() {
    this.dialog.open(AuthenticatorComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      width: '850px',
      panelClass: 'custom-modalbox'
    })
  }

  onLogoutClick() {
    /* this.router.navigate(["auctions"]); */
    this.auth.signOut();
    this.subscription.unsubscribe();
  }

  loggedIn() {
    return this.auth.isLoggedIn;
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) return outlet.activatedRoute.snapshot.url
    return '';
  }

  setActive() {
    const hamburger = document.querySelector('.hamburger');
    const mobile_menu = document.querySelector('.mobile-nav');
    hamburger.classList.toggle('is-active');
    mobile_menu.classList.toggle('is-active');
  }

  activeLink(id: string) {
    const link = document.getElementById(id);
    const sub = id.slice(-2);
    if (sub.localeCompare('_m') != 0) {
      document.querySelector('.is-active').classList.toggle('is-active');
      link.classList.toggle('is-active');
    } else {
      document.getElementById(this.mobileActiveLink).classList.remove('is-active');
      this.mobileActiveLink = id;
      link.classList.toggle('is-active');
      this.setActive();
    }

  }

}
