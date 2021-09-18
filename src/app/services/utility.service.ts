import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {


  private myData: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {

  }

  updateData(data: string): void {
    this.myData.next(data);
  }

  getData(): Observable<string> {
    return this.myData;
  }

}
