import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticatorComponent } from '../accounts/authenticator/authenticator.component';
import { AuthService } from '../services/auth.service';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  // landing page when user is not connected
  cars: any[] = [];
  display = null;
  subscription;

  constructor(private dialog: MatDialog,
    private router: Router,
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
          id: null,
          imagePath: doc.get("imageUrls"), // Contain only image path
          firstImage: null,
          bid: null,
        }

        this.car.getImage(car.imagePath[0]).then(result => {
          car.id = doc.get("id");
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

  openAuction(index: number) {
    this.router.navigate(['/car/' + this.cars[index].id]);
  }

  login(): void {
    // open AuthenticatorComponent if the user is not connected
    this.dialog.open(AuthenticatorComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      width: '850px',
      panelClass: 'custom-modalbox'
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
