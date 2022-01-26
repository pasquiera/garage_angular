import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorComponent } from '../accounts/authenticator/authenticator.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  subscription: any;
  connected = false;

  constructor(private dialog: MatDialog,
    public auth: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.auth.getLogin().subscribe(res => {
      if (res == true) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    })
  }

  login(): void {
    // open AuthenticatorComponent if the user is not connected
    this.dialog.open(AuthenticatorComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      width: '850px',
      panelClass: 'custom-modalbox'
    });

  }

}
