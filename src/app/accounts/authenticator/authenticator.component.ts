import { Component, OnInit } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth'
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;
  firestore: FirebaseTSFirestore;

  constructor(private dialogRef: MatDialogRef<AuthenticatorComponent>,) {
    this.firestore = new FirebaseTSFirestore();
    this.firebasetsAuth = new FirebaseTSAuth;
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
      this.firebasetsAuth.signInWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.dialogRef.close();
          },
          onFail: (err) => {
            alert(err);
          }
        }
      )
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
      this.firebasetsAuth.createAccountWith({
        email: email,
        password: password,
        onComplete: (uc) => {
          this.dialogRef.close();
          this.firestore.create(
            {
              path: ["Users", this.firebasetsAuth.getAuth().currentUser!.uid], // uid firebase
              data: {
                surname: '',
                name: '',
                userName: name,
                email: '',
                address: '',
                phoneNumber: '',
              },
              onComplete: (docId) => { },
              onFail: (err) => { }
            });
        },
        onFail: (err) => {
          alert("Une erreur est survenue lors de la création");
        }
      });
    }
  }





  onResetClick(resetEmail: HTMLInputElement) {
    let email = resetEmail.value;
    if (this.isNotEmpty(email)) {
      this.firebasetsAuth.sendPasswordResetEmail({
        email: email,
        onComplete: (err) => {
          alert(`Email de récupération envoyé à ${email}`);
        }
      });
    }
  }

  isNotEmpty(text: string) {
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string) {
    return text == comparedWith;
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

  getStateText() {
    switch (this.state) {
      case AuthenticatorCompState.LOGIN:
        return "Connexion";
      case AuthenticatorCompState.REGISTER:
        return "Créer un Compte";
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Mot de Passe Oublié";
    }
  }

}

export enum AuthenticatorCompState {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
