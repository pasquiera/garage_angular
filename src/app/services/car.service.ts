import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Car } from '../cars/shared/models/car';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage, public auth: AuthService) { }

  createCar(type: string, brand: string, consumption: string,
    description: string, engine: string, fuel: string,
    gearbox: string, hp: string, mileage: string,
    model: string, price: string, year: string,
    image: File[], imagePath: string[]) {

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
      imageUrls: null,
      endDate: 1633907525000,
      bid: null,

    }).then(docRef => {

      // Update storage path of each file
      for (let i = 0; i < imagePath.length; i++) {
        imagePath[i] = 'cars/' + `${docRef.id}/` + imagePath[i];
      }

      // Store file path in the car document
      this.afs.doc(`cars/${this.auth.userID}/user-cars/${docRef.id}`).update({ imageUrls: imagePath });

      this.afs.doc(`cars/${this.auth.userID}/user-cars/${docRef.id}`).update({ id: docRef.id });

      this.uploadImage(image, imagePath);

    });
  }

  uploadImage(image: File[], imagePaths: string[]) {
    // Upload each file on storage with the right url
    image.forEach((element, index) => {
      if (element != null) {
        this.storage.ref(imagePaths[index]).put(element).then(() => {
          console.log('all images uploaded successfully');
        }).catch(err => {
          console.log(err);
        })
      }
    }
    );

  }

  getAllCar(latestDoc: string) {
    // Will look for documents in all collections named user-cars
    return this.afs.collectionGroup('user-cars', ref => ref.orderBy('id').startAfter(latestDoc || 0).limit(2)).get();
  }

  getCar(doc: string) {
    return this.afs.collection<Car>('cars/rAsOJFBpQCdIY3lBHmfI9bTHYxl2/user-cars').doc(doc).valueChanges();
  }

  getImage(path: string) {
    return this.storage.ref(path).getDownloadURL().toPromise();
  }

  updateCar(doc: string, type: string, brand: string,
    consumption: number, description: string, engine: string,
    fuel: string, gearbox: string, hp: number,
    mileage: number, model: string, year: number,
    image: File[], imagePath: string[]) {

    // Update storage path of each file
    for (let i = 0; i < imagePath.length; i++) {
      imagePath[i] = 'cars/' + `${doc}/` + imagePath[i];
    }

    this.uploadImage(image, imagePath);

    this.afs.collection<Car>('cars/rAsOJFBpQCdIY3lBHmfI9bTHYxl2/user-cars').doc(doc).update({
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
      description: description,
      imageUrls: imagePath
    })
  }


}
