import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private login: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn = false;
  userID;
  userData: Observable<IUser>;
  userCredential;

  constructor(public firebaseAuth: AngularFireAuth, public afs: AngularFirestore, public storage: AngularFireStorage) { }

  signIn(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        this.userCredential = userCredential
        this.setLoginState(true);
        this.updateLogin(true);

      }).catch(err => {
        throw err;
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
          imageProfile: 'default/default.jpg',
          auctions: []
        }

        this.sendEmailVerif();
        this.setUserData(newUser);
        this.setLoginState(true);

      }).catch((error) => {
        throw error;
      })
  }

  sendEmailVerif() {
    return this.firebaseAuth.currentUser.then(res => res.sendEmailVerification());
  }

  setUserData(user: IUser) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    return userRef.set(user, {
      // update fields in the document or create it if it doesn't exists
      merge: true
    })
  }

  signOut() {
    return this.firebaseAuth.signOut().then(() => {
      this.userID = null;
      this.userCredential = null;
      this.setLoginState(false);
      this.updateLogin(false);
    });
  }

  forgotPassword(passwordResetEmail: string) {
    return this.firebaseAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        return true;
      }).catch((error) => {
        return false;
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

  getUserImage(path: string) {
    return this.storage.ref(path).getDownloadURL().toPromise();
  }

  updateDocument(lastName: string, firstName: string, userName: string, address: string, phoneNumber: string, email: string) {
    this.afs.collection<IUser>('users').doc(this.userID).update({
      lastName: lastName,
      firstName: firstName,
      userName: userName,
      email: email,
      address: address,
      phoneNumber: phoneNumber
    });
  }

  updateEmail(email: string) {
    this.userCredential.user.updateEmail(email);
  }

  uploadImage(image: any) {
    return this.storage.ref('users/' + this.userID + '/profile.jpg').put(image).then(() => {

      this.afs.collection<IUser>('users').doc(this.userID).update({
        imageProfile: 'users/' + this.userID + '/profile.jpg'
      });

    }).catch(err => {

    })
  }

  initialize(): Observable<boolean> {
    return new Observable(observer => {
      this.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          this.userID = user.uid;
          observer.next(!!user); //cast variable into true or false
        } else {
          observer.next(false);
        }
      });
    });
  }


  /* comment section (car-detail.component) functions */

  getName(id: string) {
    return this.afs.collection<IUser>('users').doc(id).get().toPromise();
  }

  getAvatar(id: string) {

    var docRef = this.afs.collection("users").doc(id);

    return docRef.get().toPromise().then((doc) => {
      if (doc.get("imageProfile") != "default/default.jpg") {
        return this.storage.ref('users/' + id + '/profile.jpg').getDownloadURL().toPromise();
      } else {
        return this.storage.ref('default/default.jpg').getDownloadURL().toPromise()
      }
    }).catch((error) => {

    });

  }

  updateAuctionsList(auctions: string[], carID: string) {

    auctions[auctions.length] = carID;
    this.afs.collection<IUser>('users').doc(this.userID).update({
      auctions: auctions,
    });
  }

  getLogin(): Observable<boolean> {
    return this.login;
  }

  updateLogin(bool: boolean): void {
    this.login.next(bool);
  }

}
