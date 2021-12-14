import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  checkForVerifiedInterval;

  constructor(private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    // wait for click on verification email and route automatically 
      this.checkForVerifiedInterval = setInterval(() => {
        console.log(this.checkForVerifiedInterval);

        this.auth.getCurrentUser().then(res => {
          res.reload();
          this.auth.getCurrentUser().then(res => {
            if(res.emailVerified == true){
              this.router.navigate(['']);
              console.log('done');
            }
          })
        })

    }, 1000)

  }

  onResendClick() {
    // send another verification email
    this.auth.sendEmailVerif();
  }

  ngOnDestroy(): void {
    clearInterval(this.checkForVerifiedInterval);
  }

}
