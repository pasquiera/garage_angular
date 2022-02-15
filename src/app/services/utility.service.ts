import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  // UtilityService use to pass data beetween component

  // user profile picture
  private myData: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // index of the alert to display
  private alert: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // use in car.service
  private completed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // enable/disable loading spinner
  private spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // use in footer component
  private route: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage) {

  }

  updateData(data: string): void {
    this.myData.next(data);
  }

  getData(): Observable<string> {
    return this.myData;
  }

  updateAlert(nb: number): void {
    // 0 : no alert
    // 1 : car-edit/settings success alert
    // 2 : car-create/car-edit error alert
    // 3 : car-create success alert
    this.alert.next(nb);
  }

  getAlert(): Observable<number> {
    return this.alert;
  }

  updateCompleted(bool: boolean): void {
    this.completed.next(bool);
  }

  getCompleted(): Observable<boolean> {
    return this.completed;
  }

  updateSpinner(bool: boolean): void {
    this.spinner.next(bool);
  }

  getSpinner(): Observable<boolean> {
    return this.spinner;
  }

  updateRoute(id: string): void {
    this.route.next(id);
  }

  getRoute(): Observable<string> {
    return this.route;
  }

   /* faq functions */

  contactMessage(name: string, email: string, text: string) {
    // store data pass in FAQ form in database
    const messageRef: AngularFirestoreCollection<any> = this.afs.collection(`contact`);

    messageRef.add({
      name: name,
      email: email,
      text: text
    });
  }

  getImage(index: number) {
    // get images for faq
    return this.storage.ref('faq/' + index +'.jpg').getDownloadURL().toPromise();
  }

}
