import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {


  private myData: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private alert: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private completed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private route: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(public afs: AngularFirestore) {

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

  contactMessage(name: string, email: string, text: string) {
    const messageRef: AngularFirestoreCollection<any> = this.afs.collection(`contact`);

    messageRef.add({
      name: name,
      email: email,
      text: text
    });
  }

}
