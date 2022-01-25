import { Component, OnInit } from '@angular/core';
import { ICar } from '../cars/shared/models/car';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  cars: any[] = [];
  display = null;

  constructor(public car: CarService) { }

  ngOnInit(): void {

    var x = Math.floor((Math.random() * 5) + 0);
    var cpt = 0;

    this.car.getCarCarousel(null, 6).subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        let car = {
          imagePath: doc.get("imageUrls"), // Contain only image path
          firstImage: null,
          bid: null,
        }

        this.car.getImage(car.imagePath[0]).then(result => {
          car.firstImage = result;
          car.bid = doc.get("bid");

          if (cpt == x) {
            this.display = car.firstImage;
          }

          cpt++

        })

        this.cars.push(car);

      });

    });
  }


}
