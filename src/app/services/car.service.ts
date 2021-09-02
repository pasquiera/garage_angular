import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage, public auth: AuthService) { }

  createCar(name: string, image: File[], imageUrls: string[]) {

    const carRef: AngularFirestoreCollection<any> = this.afs.collection(`cars`);

    carRef.add({

      owner: null,
      id: null,
      type: "auto",
      brand: name,
      model: null,
      year: 1998,
      mileage: null,
      fuel: null,
      gearbox: null,
      engine: null,
      hp: null,
      consumption: null,
      price: null,
      description: null,
      imageUrls: imageUrls,
      endDate: null,

    }).then(docRef => {

      this.afs.doc(`cars/${docRef.id}`).update({ id: docRef.id });
      this.uploadImage(image, imageUrls, docRef.id);

    });
  }

  uploadImage(image: File[], imgName: string[], docRef: string) {

    image.forEach((element, index) =>
      this.storage.ref('cars/' + `${docRef}/` + imgName[index]).put(element).then(() => {
        console.log('all images uploaded successfully');
      }).catch(err => {
        console.log(err);
      }));

  }

}
