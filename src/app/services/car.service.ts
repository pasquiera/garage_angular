import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage, public auth: AuthService) { }

  createCar(type: string, brand: string, consumption: string, description: string, engine: string, fuel: string, gearbox: string, hp: string, mileage: string, model: string, price: string, year: string, image: File[], imageUrls: string[]) {

    const carRef: AngularFirestoreCollection<any> = this.afs.collection(`cars`).doc(this.auth.userID).collection(`user-cars`);

    carRef.add({

      owner: this.auth.userID,
      id: null,
      type: type,
      brand: brand,
      model: model,
      year: year,
      mileage: mileage,
      fuel: fuel,
      gearbox: gearbox,
      engine: engine,
      hp: hp,
      consumption: consumption,
      price: price,
      description: description,
      imageUrls: imageUrls,
      endDate: 1633907525000,
      bid: null,

    }).then(docRef => {

      this.afs.doc(`cars/${this.auth.userID}/user-cars/${docRef.id}`).update({ id: docRef.id });
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

   getAllCar() {
     return this.afs.collectionGroup("user-cars").get();
   }

}
