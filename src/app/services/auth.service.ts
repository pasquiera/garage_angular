import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  userID;
  userData: Observable<IUser>;

  constructor(public firebaseAuth: AngularFireAuth, public afs: AngularFirestore, public storage: AngularFireStorage) { }

  signIn(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {

        this.setLoginState(true);
        //this.userID = userCredential.user.uid;
        //console.log(this.userID);

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
          uid: result.user.uid,
          lastName: '',
          firstName: '',
          address: '',
          phoneNumber: '',
          imageProfile: 'users/' + result.user.uid + '/profile.jpg'
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
      this.userID = null;
      this.setLoginState(false);
    });
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

  getUserData() {
    // retrive userData from firebase db
    return this.afs.collection<IUser>('users').doc(this.userID).valueChanges();
  }

  getUserImage() {
    return this.storage.ref('users/' + this.userID + '/profile.jpg').getDownloadURL().toPromise();
  }

  updateDocument(lastName: string, firstName: string, userName: string, address: string, phoneNumber: string) {
    this.afs.collection<IUser>('users').doc(this.userID).update({
      lastName: lastName,
      firstName: firstName,
      userName: userName,
      address: address,
      phoneNumber: phoneNumber
    });
  }

  uploadImage(image: any) {
    console.log(image);
    return this.storage.ref('users/' + this.userID + '/profile.jpg').put(image).then(() => {
      console.log('image uploaded successfully');

      this.afs.collection<IUser>('users').doc(this.userID).update({
        imageProfile: 'users/' + this.userID + '/profile.jpg'
      });

    }).catch(err => {
      console.log(err);
    })
  }

  initialize(): Observable<boolean> {
    return new Observable(observer => {
      console.log("Observable Initialized");
      this.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log(user.uid);
          this.userID = user.uid;
          observer.next(!!user)
        }
      });
    });
  }

}