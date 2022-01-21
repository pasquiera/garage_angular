import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {


  private myData: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private alert: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private completed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {

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

}
