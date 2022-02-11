import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-user-bid',
  templateUrl: './user-bid.component.html',
  styleUrls: ['./user-bid.component.css']
})
export class UserBidComponent implements OnInit {

  myCars: any[] = [];
  auctions: any[] = [];
  cpt = 0;

  constructor(public car: CarService,
    public auth: AuthService,
    public utility: UtilityService) { }

  ngOnInit(): void {

    this.car.getUserCars().subscribe(querySnapshot => {
      // retrive all cars sell by current user from the database
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

        this.myCars.push(car);
      });
    });

    this.auth.getUserData().pipe(first()).subscribe(res => {
      // get auctions[] array which contains all user current auctions
      const auctions = res.auctions;
      auctions.forEach(element => this.getCar(element));
    })
  }

  getCar(element: any) {
    // get all cars on which the current user has bid
    this.car.getCarByID(element).subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        let car = {
          owner: doc.get("owner"),
          id: doc.get("id"),
          brand: doc.get("brand"),
          model: doc.get("model"),
          price: doc.get("price"),
          imagePath: doc.get("imageUrls"), // Contain only image path
          firstImage: null,
          endDate: doc.get("endDate"),
          bid: doc.get("bid"),
          ID: doc.get("buyer"),
          buyer: ''
        }

        this.car.getImage(car.imagePath[0]).then(result => {
          car.firstImage = result;
        })

        this.auctions[this.cpt] = car;
        this.getBuyerName(this.cpt);

        this.cpt++;
      })
    })
  }

  getBuyerName(index: number) {
    if (this.auctions[index].ID == this.auth.userID) {
      this.auctions[index].buyer = "Vous"
    } else {
      this.auth.getName(this.auctions[index].ID).then(res => {
        this.auctions[index].buyer = res.get("userName");
        document.getElementById('b:' + this.auctions[index].id).style.color = 'red';
      })
    }
  }

  stop(event) {
    // stop routerlink propagation for carousel cursors
    event.stopPropagation();
  }

  delete(event, id: string) {
    event.stopPropagation();
    this.car.deleteCar(id);
    document.getElementById(id).remove();
    const index = this.myCars.indexOf(id);
    if (index > -1) {
      this.myCars.splice(index, 1);
    }
  }

  ngOnDestroy() {
  }
}

