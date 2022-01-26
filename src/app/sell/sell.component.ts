import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  cars: any[] = [];
  display = null;
  subscription;

  constructor(private router: Router,
    public car: CarService,
    public auth: AuthService) { }

  ngOnInit(): void {

    const url = location.pathname.split('/').slice(-1)[0]

    this.subscription = this.auth.getLogin().subscribe(res => {
      if (res == true && url == 'sell') {
        this.router.navigate(["create"]);
      }
    })

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
