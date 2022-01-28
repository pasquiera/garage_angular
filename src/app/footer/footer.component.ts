import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorComponent } from '../accounts/authenticator/authenticator.component';
import { CguComponent } from '../cgu/cgu.component';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  subscription: any;
  connected = false;

  constructor(private dialog: MatDialog,
    public auth: AuthService,
    public utility: UtilityService) { }

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

  selectRoute(id: string) {
    this.utility.updateRoute(id);
  }

  openDialog(title: string) {
    this.dialog.open(CguComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: title,
      },
      width: '850px',
      panelClass: 'custom-modalbox'
    });
  }
}
