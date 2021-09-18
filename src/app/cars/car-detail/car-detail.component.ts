import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticatorComponent } from 'src/app/accounts/authenticator/authenticator.component';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  isShown: boolean = false;
  userName: string = "null";
  avatar: string;
  subscription;

  constructor(private dialog: MatDialog, public auth: AuthService, private utility: UtilityService) { }

  ngOnInit(): void {
    console.log("initialised");
    this.subscription = this.utility.getData().subscribe((data) => {
      console.log(data);
          this.avatar = data;
    });
  }

  toggleShow(): void {
    this.isShown = !this.isShown;
  }

  sendComment(): void {

    if (this.auth.isLoggedIn == false) {
      this.dialog.open(AuthenticatorComponent, {
        // NoopScrollStrategy: does nothing
        scrollStrategy: new NoopScrollStrategy(),
        panelClass: 'custom-modalbox'
      });
    } else {
      console.log("Comment posted");
    }

  }

  ngOnDestroy(): void {
    console.log("destroyed");
    this.subscription.unsubscribe();
  }

  /*  ngAfterViewInit() {
     const textarea = document.querySelector("textarea");
     textarea.addEventListener("keyup", e => {
       textarea.style.height = "20px";
       let scHeight = (e.target as HTMLInputElement).scrollHeight;
       textarea.style.height = `${scHeight}px`;
     });
   } */

}
