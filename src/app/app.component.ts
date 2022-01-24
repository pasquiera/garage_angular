import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AuthenticatorComponent } from './accounts/authenticator/authenticator.component';
import { Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations'
import { AuthService } from './services/auth.service';
import { UtilityService } from './services/utility.service';

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
  userImg = "assets/img/default.jpg";
  userName;
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
          this.userName = user.userName;
          this.auth.getUserImage(user.imageProfile).then(val => {
            this.userImg = val;
            this.utility.updateData(val);
          })

        })

      } else {
        this.utility.updateData("assets/img/default.jpg");
        const url = this.router.url;
        let sub = url.substring(0, 5);

        if (url == '/settings' || url == '/bid' || url == '/create' || sub == '/edit') {
          this.router.navigate(['/auctions']);
          this.activeLink('auction');
        }
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

    document.querySelector('.is-active').classList.toggle('is-active');
    document.getElementById(this.mobileActiveLink).classList.toggle('is-active');

    const sub = id.slice(0, id.lastIndexOf('_m'));
    const sub2 = id.slice(-2);

    if (sub2.localeCompare('_m') == 0) {
      this.mobileActiveLink = id;
      document.getElementById(id).classList.toggle('is-active');
      document.getElementById(sub).classList.toggle('is-active');
      this.setActive();
    } else {
      this.mobileActiveLink = id + '_m';
      document.getElementById(this.mobileActiveLink).classList.toggle('is-active');
      document.getElementById(id).classList.toggle('is-active');
    }
  }

}
