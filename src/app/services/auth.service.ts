import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IUser } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  isEmailVerified = false;

  constructor(public firebaseAuth: AngularFireAuth, public afs: AngularFirestore,) { }

  signIn(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {

        this.setLoginState(true);

        localStorage.setItem('user', JSON.stringify(userCredential.user));
        let data = JSON.parse(localStorage.getItem('user'));
        this.isEmailVerified = data.emailVerified;

      }).catch(err => {
        alert(err.message);
      })
  }

  SignUp(userName: string, email: string, password: string) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {

        const newUser: IUser = {
          userName,
          email,
          uid: result.user.uid
        }

        this.sendEmailVerif();
        this.setUserData(newUser);
        alert("Création du compte");

      }).catch((error) => {
        alert(error.message);
      })
  }

  sendEmailVerif() {
    return this.firebaseAuth.currentUser.then(res => res.sendEmailVerification());
  }

  setUserData(user: IUser) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    return userRef.set(user, {
      merge: true
    })
  }

  signOut() {
    return this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
    })
  }

  forgotPassword(passwordResetEmail: string) {
    this.firebaseAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        alert('un e-mail de récupération à été envoyé');
      }).catch((error) => {
        alert(error);
      })
  }

  getCurrentUser() {
    return this.firebaseAuth.currentUser;
  }
  
  setLoginState(value: boolean) {
    this.isLoggedIn = value;
  }



}
