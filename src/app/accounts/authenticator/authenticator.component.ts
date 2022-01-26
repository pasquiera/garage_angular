import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;
  touched = false;
  err_login = ""
  err_register = "";
  err_reset = ""

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

      }).catch(error => {
        if (error.code == 'auth/invalid-email') {
          document.getElementById('email').classList.add('invalid');
          this.showInfo("Veuillez saisir une adresse mail valide", "info-login")
        }
        else if (error.code == 'auth/wrong-password') {
          document.getElementById('password').classList.add('invalid');
          this.showInfo("Mot de passe non valide", "info-login")
        } else if (error.code == 'auth/user-not-found') {
          document.getElementById('email').classList.add('invalid');
          document.getElementById('password').classList.add('invalid');
          this.showInfo("Email et/ou mot de passe incorrect(s)", "info-login")
        }
      });

    } else {
      if (!this.isNotEmpty(email)) {
        document.getElementById('email').classList.add('invalid');
        this.showInfo("Veuillez saisir une adresse mail", "info-login")
      }
      else if (!this.isNotEmpty(password)) {
        document.getElementById('password').classList.add('invalid');
        this.showInfo("Veuillez saisir un mot de passe", "info-login")
      }

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

      }).catch(error => {
        if (error.code == 'auth/invalid-email') {
          document.getElementById('email3').classList.add('invalid');
          this.showInfo("Veuillez saisir une adresse mail valide", "info-register")
        }
        else if (error.code == 'auth/weak-password') {
          document.getElementById('password3').classList.add('invalid');
          document.getElementById('passwordConfirm').classList.add('invalid');
          this.showInfo("Le mot de passe doit contenir au moins 6 caractères", "info-register")
        }
      });
    } else {
      if (!this.isNotEmpty(name)) {
        document.getElementById('userName').classList.add('invalid');
        this.showInfo("Veuillez saisir un nom d'utilisateur", "info-register")
      }
      else if (!this.isNotEmpty(email)) {
        document.getElementById('email3').classList.add('invalid');
        this.showInfo("Veuillez saisir une adresse mail", "info-register")
      }
      else if (!this.isNotEmpty(password)) {
        document.getElementById('password3').classList.add('invalid');
        this.showInfo("Veuillez saisir un mot de passe", "info-register")
      }
      else if (!this.isAMatch(password, confirmPassword)) {
        document.getElementById('password3').classList.add('invalid');
        document.getElementById('passwordConfirm').classList.add('invalid');
        this.showInfo("Les mots de passe ne correspondent pas", "info-register")
      }
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
          document.getElementById('email2').classList.add('invalid');
          this.showInfo("Veuillez saisir une adresse mail valide", "info-reset")
        }
      });

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
          //this.router.navigate(["emailVerification"]);
          Swal.fire({
            title: 'Un mail de confirmation vous a été envoyé',
            html: 'Merci de vérifier votre adresse mail',
            icon: 'success',
            confirmButtonColor:'#1983CC',
          });
        }
      })
    }
  }

  showInfo(error: string, id: string) {
    if (id == "info-login") {
      this.err_login = error;
    } else if (id == "info-register") {
      this.err_register = error;
    } else {
      this.err_reset = error;
    }
    document.getElementById("info " + id).hidden = false;
  }

  resetError(id: string) {
    const element = document.getElementById(id);
    if (element.classList.contains('invalid')) {
      element.classList.remove('invalid');
    }
  }

  isNotEmpty(text: string): boolean {
    // check if the input is not empty
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string): boolean {
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
