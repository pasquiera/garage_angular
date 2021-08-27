import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage) { }

  uploadImage(image: File[], imgName: string[]) {

    image.forEach((element, index) =>
      this.storage.ref('cars/' + 'cars1/' + imgName[index]).put(element).then(() => {
        console.log('all images uploaded successfully');

      }).catch(err => {
        console.log(err);
      }));

  }

}
