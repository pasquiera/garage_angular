import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Car } from '../cars/shared/models/car';
import { AuthService } from './auth.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(public afs: AngularFirestore,
    public storage: AngularFireStorage,
    public auth: AuthService,
    public utility: UtilityService,) { }

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
      createDateDsc: -Date.now(), // for sorting purposes only
      bid: 0,
      bid_Dsc: 0, // for sorting purposes only
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
    const val = image.filter(x => x != null).length;
    if (val == 0) {
      this.utility.updateCompleted(true);
    } else {
      let cpt = 0;
      image.forEach((element, index) => {
        if (element != null) {
          this.storage.ref(imagePaths[index]).put(element).then(() => {
            cpt++
            if (val == cpt) {
              this.utility.updateCompleted(true);
            }
          });
        }
      }
      );
    }
  }

    /* sorting functions */

  getCarDsc(latestDoc: string, type: string) {
    if (type == "all") {
      return this.afs.collectionGroup('user-cars', ref => ref.orderBy('createDateDsc').startAfter(latestDoc).limit(2)).get();
    } else {
      // type == "auto" || type == "moto"
      return this.afs.collectionGroup('user-cars', ref => ref.where('type', '==', type).orderBy('createDateDsc').startAfter(latestDoc).limit(2)).get();
    }
  }

  getCarAsc(latestDoc: string, type: string) {
    // All vehicle in ascending order
    if (type == "all") {
      return this.afs.collectionGroup('user-cars', ref => ref.orderBy('createDateAsc').startAfter(latestDoc).limit(2)).get();
    } else {
      return this.afs.collectionGroup('user-cars', ref => ref.where('type', '==', type).orderBy('createDateAsc').startAfter(latestDoc).limit(2)).get();
    }
  }

  getCarPriceAsc(latestDoc: string, type: string) {
    // 
    if (type == "all") {
      return this.afs.collectionGroup('user-cars', ref => ref.orderBy('bid').startAfter(latestDoc).limit(2)).get();
    } else {
      return this.afs.collectionGroup('user-cars', ref => ref.where('type', '==', type).orderBy('bid').startAfter(latestDoc).limit(2)).get();
    }
  }

  getCarPriceDsc(latestDoc: string, type: string) {
    //
    if (type == "all") {
      return this.afs.collectionGroup('user-cars', ref => ref.orderBy('bid_Dsc').startAfter(latestDoc).limit(2)).get();
    } else {
      return this.afs.collectionGroup('user-cars', ref => ref.where('type', '==', type).orderBy('bid_Dsc').startAfter(latestDoc).limit(2)).get();
    }
  }

  /* update functions */

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

    this.afs.collection<Car>('cars/' + this.auth.userID + '/user-cars').doc(doc).update({
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

  updateBid(bid: number, owner: string, id: string, buyer: string) {
    this.afs.collection<Car>('cars/' + owner + '/user-cars').doc(id).update({
      bid: bid,
      bid_Dsc: -bid,
      buyer: buyer,
    })
  }

   /* other functions */

   getCarCarousel(latestDoc: string) {
    // get 10 vehicles for header carousel
    return this.afs.collectionGroup('user-cars', ref => ref.orderBy('createDateAsc').startAfter(latestDoc).limit(10)).get();
  }

  getCar(doc: string) {
    // Get a specific car of the current user (car-edit)
    return this.afs.collection<Car>('cars/' + this.auth.userID + '/user-cars').doc(doc).valueChanges();
  }

  getCarDetail(carID: string, ownerID: string) {
    // Get a specific car for car-detail component
    return this.afs.collection<Car>('cars/' + ownerID + '/user-cars').doc(carID).valueChanges();
  }

  getCarOwner(id: string) {
    // Get a specific car for car-detail component
    return this.afs.collectionGroup('user-cars', ref => ref.where('id', '==', id)).get();
  }

  getUserCars() {
    return this.afs.collectionGroup('user-cars', ref => ref.where('owner', '==', this.auth.userID)).get();
  }

  getCarByID(carID: string) {
    return this.afs.collectionGroup('user-cars', ref => ref.where('id', '==', carID)).get();
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

}
