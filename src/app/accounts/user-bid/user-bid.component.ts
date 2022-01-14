import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-user-bid',
  templateUrl: './user-bid.component.html',
  styleUrls: ['./user-bid.component.css']
})
export class UserBidComponent implements OnInit {

  cars: any[] = [];

  constructor(public car: CarService) { }

  ngOnInit(): void {
    this.car.getUserCars().subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        const car = {
          owner: doc.get("owner"),
          id: doc.get("id"),
          brand: doc.get("brand"),
          model: doc.get("model"),
          price: doc.get("price"),
          imagePath: doc.get("imageUrls"), // Contain only image path
          firstImage: null,
          endDate: doc.get("endDate"),
          bid: doc.get("bid"),
        }

        this.car.getImage(car.imagePath[0]).then(result => {
          car.firstImage = result;
        })

        this.cars.push(car);
      });
    });
  }

  stop(event) {
    // stop routerlink propagation for carousel cursors
    event.stopPropagation();
}

  delete(event, id: string) {
    event.stopPropagation();
    this.car.deleteCar(id);
    document.getElementById(id).remove();
    const index = this.cars.indexOf(id);
    if (index > -1) {
      this.cars.splice(index, 1);
    }
  }
}

