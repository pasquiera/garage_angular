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

  constructor(private router: Router,
    private dialogRef: MatDialogRef<AuthenticatorComponent>,
    public auth: AuthService,
    public utility: UtilityService) {
  }

  ngOnInit(): void {
  }

  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
  ) {
    let email = loginEmail.value;
    let password = loginPassword.value;

    if (this.isNotEmpty(email) && this.isNotEmpty(password)) {

      this.auth.signIn(email, password).then(res => { //make a callback function isEmailVerified

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

      });

    }
  }

  onRegisterClick(
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
        this.dialogRef.close();
      })
    }
  }

  onResetClick(resetEmail: HTMLInputElement) {
    let email = resetEmail.value;
    if (this.isNotEmpty(email)) {
      this.auth.forgotPassword(email);
    }
  }

  isNotEmpty(text: string) {
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string) {
    return text == comparedWith;
  }

  signUpClick() {
    document.getElementById('container').classList.add('right-panel-active');
  }

  signInClick() {
    document.getElementById('container').classList.remove('right-panel-active');
    this.onLoginClick();
  }

  onForgotPasswordClick() {
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick() {
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick() {
    this.state = AuthenticatorCompState.LOGIN;
  }

  isLoginState() {
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState() {
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState() {
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
