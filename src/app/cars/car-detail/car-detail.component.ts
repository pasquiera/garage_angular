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
  carInfo: ICar;
  lg = 0;
  files: any = [];
  seller;
  buyer;

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
          createDateAsc: doc.get("createDateAsc"),
          buyer: doc.get("buyer"),
        }

        this.getCarImages(this.carInfo.imageUrls);
        this.getOwnerInfo(this.carInfo.owner);

        if (this.carInfo.buyer == null) {
          this.buyer.userName = "-";
        } else {
          this.getBuyerInfo(this.carInfo.buyer);
        }

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
          panelClass: 'custom-modalbox'
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
    // (Should use a reactive form to update bid instead)
    let bid = Number(bidValue.value);
    if (bid > this.carInfo.bid) {
      this.auth.getUserData().pipe(first()).subscribe(user => {
        this.buyer.userName = user.userName;
        this.auth.getUserImage(user.imageProfile).then(val => {
          this.buyer.avatar = val;
          this.car.updateBid(bid, this.carInfo.owner, this.carInfo.id, this.auth.userID);
          if (!user.auctions.includes(this.carInfo.id)) {
            this.auth.updateAuctionsList(user.auctions, this.carInfo.id);
          }
          this.carInfo.bid = bid;
        })
      })
    }

  }


}
