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
      brand: brand.toLowerCase(),
      model: model.toLowerCase(),
      year: year,
      mileage: mileage,
      fuel: fuel,
      gearbox: gearbox,
      engine: engine.toLowerCase(),
      hp: hp,
      consumption: consumption,
      price: price,
      description: description,
      imageUrls: null,
      endDate: Date.now() + 604800000,
      createDateAsc: Date.now(),
      createDateDsc: -Date.now(),
      bid: 0,
      buyer: null,

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
    console.log(image);
    console.log(imagePaths);
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
    // Will look for documents in all collections named user-cars in descending order (most recent first)
    return this.afs.collectionGroup('user-cars', ref => ref.orderBy('createDateDsc').startAfter(latestDoc).limit(2)).get();
  }

  getAllCarAsc(latestDoc: string) {
    // All vehicle in ascending order
    return this.afs.collectionGroup('user-cars', ref => ref.orderBy('createDateAsc').startAfter(latestDoc).limit(10)).get();
  }

  getCarOnly(latestDoc: string) {
    // Only type 'auto'
    return this.afs.collectionGroup('user-cars', ref => ref.where('type', '==', 'auto').orderBy('createDateDsc').startAfter(latestDoc).limit(2)).get();
  }

  getBikeOnly(latestDoc: string) {
    // Only type 'moto'
    return this.afs.collectionGroup('user-cars', ref => ref.where('type', '==', 'moto').orderBy('createDateDsc').startAfter(latestDoc).limit(2)).get();
  }

  getCar(doc: string) {
    // Get a specific car of the current user (car-edit)
    return this.afs.collection<Car>('cars/' + this.auth.userID + '/user-cars').doc(doc).valueChanges();
  }

  getUserCars() {
    return this.afs.collectionGroup('user-cars', ref => ref.where('owner', '==', this.auth.userID)).get();
  }

  getImage(path: string) {
    return this.storage.ref(path).getDownloadURL().toPromise();
  }

  getCarCount() {
    // not optimal way to get the count
    return this.afs.collectionGroup('user-cars').get();
  }

  getRandomCar(latestDoc: string) {
    return this.afs.collectionGroup('user-cars', ref => ref.orderBy('id').startAfter(latestDoc).limit(1)).get();
  }

  deleteCar(id: string) {
    this.afs.collection<Car>('cars/' + this.auth.userID + '/user-cars').doc(id).delete().then(res => {
      // console.log('Product deleted Successfully');
    })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
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

    this.afs.collection<Car>('cars/'+this.auth.userID+'/user-cars').doc(doc).update({
      type: type,
      brand: brand.toLowerCase(),
      model: model.toLowerCase(),
      year: year,
      mileage: mileage,
      fuel: fuel,
      gearbox: gearbox,
      engine: engine.toLowerCase(),
      hp: hp,
      consumption: consumption,
      description: description,
      imageUrls: imagePath
    })
  }


}
