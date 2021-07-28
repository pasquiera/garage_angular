import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  auth = new FirebaseTSAuth();
  checkForVerifiedInterval;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isSignedIn() && !this.auth.getAuth().currentUser!.emailVerified) {
      this.auth.sendVerificationEmail();
      this.checkForVerifiedInterval = setInterval(() => {
        console.log(this.checkForVerifiedInterval);
        this.auth.getAuth().currentUser.reload()
          .then(ok => {
            if (this.auth.getAuth().currentUser.emailVerified) {
                this.router.navigate(['']);
                console.log(this.checkForVerifiedInterval);
            }
          })
    }, 1000)
    } else {
      this.router.navigate(['']);
    }
  }

  onResendClick() {
    this.auth.sendVerificationEmail();
  }

  ngOnDestroy(): void {
    clearInterval(this.checkForVerifiedInterval);
  }

}
