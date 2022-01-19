import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { ICar } from '../shared/models/car';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  private subscription: Subscription[];
  carInfo: ICar;
  lg = 0;
  files: any = [];
  seller;

  constructor(private route: ActivatedRoute, public car: CarService, public auth: AuthService) { }

  ngOnInit(): void {

    this.subscription = [];

    this.carInfo = {
      owner: null,
      id: null,
      brand: null,
      model: null,
      price: null,
      imageUrls: null,
      endDate: null,
      bid: null,
      type: null,
      year: null,
      mileage: null,
      fuel: null,
      gearbox: null,
      engine: null,
      hp: null,
      consumption: null,
      description: null,
    }

    this.seller = {
      userName: null,
      avatar: "assets/img/default.jpg"
    }

    this.subscription[0] = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.getCarInfo(params['id']);
      }
    });
  }

  async getCarInfo(id: string) {
    await this.car.getCarDetail(id).subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        this.carInfo = {
          owner: doc.get("owner"),
          id: doc.get("id"),
          brand: doc.get("brand"),
          model: doc.get("model"),
          price: doc.get("price"),
          imageUrls: doc.get("imageUrls"),
          endDate: doc.get("endDate"),
          bid: doc.get("bid"),
          type: doc.get("type"),
          year: doc.get("year"),
          mileage: doc.get("mileage"),
          fuel: doc.get("fuel"),
          gearbox: doc.get("gearbox"),
          engine: doc.get("engine"),
          hp: doc.get("hp"),
          consumption: doc.get("consumption"),
          description: doc.get("description"),
        }

        this.getCarImages(this.carInfo.imageUrls);
        this.getOwnerInfo(this.carInfo.owner);

      });
    })
  }

  getCarImages(imagePath: string[]) {
    // 
    this.files = new Array(imagePath.length);
    for (let i = 0; i < this.files.length; i++) {
      this.car.getImage(imagePath[i]).then(url => {
        this.files[i] = [url];
        this.lg++;
      });
    }
  }

  getOwnerInfo(owner: string) {
    Promise.all([this.auth.getName(owner), this.auth.getAvatar(owner)]).then(data => {
      this.seller = { userName: data[0].get("userName"), avatar: data[1] };
    });
  }

}
