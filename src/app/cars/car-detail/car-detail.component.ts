import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthenticatorComponent } from 'src/app/accounts/authenticator/authenticator.component';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/car.service';
import { ICar } from '../shared/models/car';
import { CarouselDialogComponent } from '../upload-box/carousel-dialog/carousel-dialog.component';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  private subscription: Subscription[];
  carInfo;
  lg = 0;
  files: any = [];
  seller;
  buyer;
  cpt = 0;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, public car: CarService, public auth: AuthService) { }

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
      createDateAsc: null,
      buyer: null,
      date1: null,
      date2: null,
    }

    this.seller = {
      userName: null,
      avatar: "assets/img/default.jpg"
    }

    this.buyer = {
      userName: null,
      avatar: "assets/img/default.jpg"
    }

    this.subscription[0] = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.getCarInfo(params['id']);
      }
    });
  }

  getCarInfo(id: string) {
    this.car.getCarOwner(id).pipe(first()).subscribe(querySnapshot => {
      querySnapshot.docs.forEach(val => {
        this.subscription[1] = this.car.getCarDetail(id, val.get("owner")).subscribe(doc => {
          this.carInfo = {
            owner: doc.owner,
            id: doc.id,
            brand: doc.brand,
            model: doc.model,
            price: doc.price,
            imageUrls: doc.imageUrls,
            endDate: doc.endDate,
            bid: doc.bid,
            type: doc.type,
            year: doc.year,
            mileage: doc.mileage,
            fuel: doc.fuel,
            gearbox: doc.gearbox,
            engine: doc.engine,
            hp: doc.hp,
            consumption: doc.consumption,
            description: doc.description,
            createDateAsc: doc.createDateAsc,
            buyer: doc.buyer,
          }

          const dateObject1 = new Date(this.carInfo.createDateAsc);
          const dateObject2 = new Date(this.carInfo.endDate);
          this.carInfo.date1 = dateObject1.toLocaleString();
          this.carInfo.date2 = dateObject2.toLocaleString();

          if (this.cpt == 0) {
            // don't need to update after init
            this.getCarImages(this.carInfo.imageUrls);
            this.getOwnerInfo(this.carInfo.owner);

            if (this.carInfo.buyer == null) {
              this.buyer.userName = "-";
            } else {
              this.getBuyerInfo(this.carInfo.buyer);
            }
          }

          this.cpt++;

        });
      })
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

  getBuyerInfo(buyer: string) {
    Promise.all([this.auth.getName(buyer), this.auth.getAvatar(buyer)]).then(data => {
      this.buyer = { userName: data[0].get("userName"), avatar: data[1] };
    });
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

  loggedIn() {
    return this.auth.isLoggedIn;
  }

  openDialog(index: number) {
    // open CarouselDialogComponent to show an image
    this.dialog.open(CarouselDialogComponent,
      {
        // NoopScrollStrategy: does nothing
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          imageURL: this.files,
          index: index,
        }
      });
  }

  OnlyNumbersAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }

    return true;
  }

  checkBid(bidValue: HTMLInputElement) {
    let bid = Number(bidValue.value);
    if (bid > this.carInfo.bid) {
      (document.querySelector('.form_input') as HTMLInputElement).value = '';
      document.querySelector('.form_input').classList.remove('error');
      this.auth.getUserData().pipe(first()).subscribe(user => {
        this.buyer.userName = user.userName;
        this.auth.getUserImage(user.imageProfile).then(val => {
          this.buyer.avatar = val;
          this.car.updateBid(bid, this.carInfo.owner, this.carInfo.id, this.auth.userID);
          if (!user.auctions.includes(this.carInfo.id)) {
            this.auth.updateAuctionsList(user.auctions, this.carInfo.id);
          }
        })
      })
    } else {
      document.querySelector('.form_input').classList.add('error');
    }
  }

  scrollFunction() {
    var elmnt = document.getElementById("more-info");
    elmnt.scrollIntoView();
  }

  ngOnDestroy() {
    this.subscription.forEach(element => element.unsubscribe());
  }

}
