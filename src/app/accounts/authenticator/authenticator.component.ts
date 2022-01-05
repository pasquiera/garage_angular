import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;
  touched = false;

  constructor(private router: Router,
    private dialogRef: MatDialogRef<AuthenticatorComponent>,
    public auth: AuthService,
    public utility: UtilityService) {
  }

  ngOnInit(): void {
  }


  onLogin(
    // sign in function
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
  ) {
    let email = loginEmail.value;
    let password = loginPassword.value;

    if (this.isNotEmpty(email) && this.isNotEmpty(password)) {

      this.auth.signIn(email, password).then(res => { //make a callback function isEmailVerified

        this.checkVerif();

      });

    }
  }

  onRegisterClick(
    // sign up function
    registerName: HTMLInputElement,
    registerEmail: HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ) {
    let name = registerName.value;
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;

    if (
      this.isNotEmpty(name) &&
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmPassword) &&
      this.isAMatch(password, confirmPassword)
    ) {

      this.auth.SignUp(name, email, password).then(res => {

        this.checkVerif();

      })
    }
  }


  checkVerif(): void {
    // check if the email is verified
    if (this.auth.isLoggedIn) {
      this.dialogRef.close();
      this.auth.getCurrentUser().then(res => {
        if (res.emailVerified == true) {
          //this.router.navigate(["auctions"]);
        } else {
          this.router.navigate(["emailVerification"]);
        }
      })
    }
  }

  onResetClick(resetEmail: HTMLInputElement) {
    // reset password function
    let email = resetEmail.value;
    if (this.isNotEmpty(email)) {
      this.auth.forgotPassword(email).then(res => {
        if (res) {
          this.state = AuthenticatorCompState.OK_RESET;
        } else {
          alert("Email invalide")
        }
      });

    }
  }

  isNotEmpty(text: string) {
    // check if the input is not empty
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string) {
    // check if passwords are identical
    return text == comparedWith;
  }

  onForgotPasswordClick() {
    // switch to forgot password state when button clicked
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick() {
    // switch to register state
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick() {
    // switch to login state
    this.state = AuthenticatorCompState.LOGIN;
  }

  setTouched() {
    if (!this.touched) {
      this.touched = true;
      document.getElementById('container').classList.add('touched');
    }
  }

  /* check current state to display the right form */

  isLoginState() {
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState() {
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState() {
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  isOkResetState() {
    return this.state == AuthenticatorCompState.OK_RESET;
  }

}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
  OK_RESET,
}
