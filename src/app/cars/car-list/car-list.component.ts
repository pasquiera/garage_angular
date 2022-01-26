import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car.service';
import { ICar } from '../shared/models/car';


@Component({
    selector: 'app-car-list',
    templateUrl: '/car-list.component.html',
    styleUrls: ['./car-list.component.css']
})

export class CarListComponent implements OnInit {

    public title = ' enchères en cours';
    public placeholder = "Trier par"
    public showBadge: boolean = true;
    public filteredCars: ICar[] = [];
    public errMsg: string = '';
    public default: any[] = [];
    public latestDoc = null; // Store latest document
    empty = false;
    carousel: any[] = [];

    state = TypeState.ALL;
    filter = Filter.DATE_DSC;

    constructor(public car: CarService) { }

    ngOnInit(): void {
        this.load(this.car.getCarDsc(this.latestDoc, "all"));
        this.getCount();
        this.carouselDisplay();
    }

    getCount() {
        this.car.getCarCount().subscribe(querySnapshot => {
            var count = querySnapshot.size;
            this.title = count + this.title;
        });
    }

    createCar(doc: any): ICar {
        // create and return a car with doc values
        const car = {
            owner: doc.get("owner"),
            id: doc.get("id"),
            type: doc.get("type"),
            brand: doc.get("brand"),
            model: doc.get("model"),
            year: doc.get("year"),
            mileage: doc.get("mileage"),
            fuel: doc.get("fuel"),
            gearbox: doc.get("gearbox"),
            engine: doc.get("engine"),
            hp: doc.get("hp"),
            consumption: doc.get("consumption"),
            price: doc.get("price"),
            description: doc.get("description"),
            imagePath: doc.get("imageUrls"), // Contain only image path
            imageUrls: [],
            endDate: doc.get("endDate"),
            bid: doc.get("bid"),
            bid_Dsc: null,
            createDateAsc: doc.get("createDateAsc"),
            buyer: doc.get("buyer"),
        }

        for (let i = 0; i < car.imagePath.length; i++) {
            // Download and store each image url on car.imagePath
            this.car.getImage(car.imagePath[i]).then(result => {
                if (i == 0) {
                } // hide loading component when i == 0 is loaded
                car.imageUrls[i] = result;
            })
        };

        return car;
    }

    load(fn: any): void {
        let cars: ICar[] = [];
        fn.subscribe(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                cars.push(this.createCar(doc));
            });

            // Update lastestDoc
            this.latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            // Unattach event listener if no more docs
            if (querySnapshot.empty) {
                this.empty = true;
            }
            this.filteredCars.push(...cars);
        });
    }

    carouselDisplay(): void {
        let cars: ICar[] = [];
        this.car.getCarCarousel(null, 10).subscribe(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                let car = {
                    id: null,
                    brand: null,
                    model: null,
                    year: null,
                    imagePath: doc.get("imageUrls"), // Contain only image path
                    firstImage: null,
                    endDate: null,
                    bid: null,
                }

                this.car.getImage(car.imagePath[0]).then(result => {
                    car.firstImage = result;
                    car.id = doc.get("id");
                    car.brand = doc.get("brand");
                    car.model = doc.get("model");
                    car.year = doc.get("year");
                    car.endDate = doc.get("endDate");
                    car.bid = doc.get("bid");
                })

                this.carousel.push(car);
            });

        });
    }

    loadMore() {
        // when loadMore button is clicked
        let type;
        if (!this.empty) {
            if (this.isAllState()) {
                type = "all";
            } else if (this.isCarState()) {
                type = "auto";
            } else if (this.isBikeState()) {
                type = "moto";
            }

            switch (this.filter) {
                case Filter.DATE_DSC:
                    this.load(this.car.getCarDsc(this.latestDoc, type));
                    break;
                case Filter.DATE_ASC:
                    this.load(this.car.getCarAsc(this.latestDoc, type));
                    break;
                case Filter.PRICE_ASC:
                    this.load(this.car.getCarPriceAsc(this.latestDoc, type));
                    break;
                case Filter.PRICE_DSC:
                    this.load(this.car.getCarPriceDsc(this.latestDoc, type));
                    break;
            }
        }
    }

    delete(event) {
        // stop routerlink propagation for carousel cursors
        event.stopPropagation();
    }

    reset() {
        // when a new filter is selected
        this.filteredCars = [];
        this.latestDoc = null;
        this.empty = false;
        document.querySelector('.filter_btn.active').classList.toggle('active');
    }

    ngOnDestroy() {
        
    }

    /* switch to the right state when filter is clicked */

    onAllClick() {
        // switch to all cars state
        this.state = TypeState.ALL;
        this.reset();
        document.getElementById("all_type").classList.add('active');
        this.load(this.car.getCarDsc(this.latestDoc, "all"));
    }

    onCarClick() {
        // switch to car state
        this.state = TypeState.CAR;
        this.reset();
        document.getElementById("car_type").classList.add('active');
        this.load(this.car.getCarDsc(this.latestDoc, "auto"));
    }

    onBikeClick() {
        // switch to bike state
        this.state = TypeState.BIKE;
        this.reset();
        document.getElementById("bike_type").classList.add('active');
        this.load(this.car.getCarDsc(this.latestDoc, "moto"));
    }

    sortFilter(filter: string) {
        this.filteredCars = [];
        this.latestDoc = null;
        this.empty = false;
        switch (filter) {
            case 'priceAsc':
                this.filter = Filter.PRICE_ASC;
                this.placeholder = "Prix croissant" ;
                break;
            case 'priceDsc':
                this.filter = Filter.PRICE_DSC;
                this.placeholder = "Prix décroissant" ;
                break;
            case 'dateAsc':
                this.filter = Filter.DATE_ASC;
                this.placeholder = "Annonces moins récentes" ;
                break;
            case 'dateDsc':
                this.filter = Filter.DATE_DSC;
                this.placeholder = "Annonces plus récentes" ;
                break;
        }
        this.loadMore();
    }

    /* check current state to display the right vehicle list */

    isAllState() {
        return this.state == TypeState.ALL;
    }

    isCarState() {
        return this.state == TypeState.CAR;
    }

    isBikeState() {
        return this.state == TypeState.BIKE;
    }

}

export enum TypeState {
    ALL,
    CAR,
    BIKE,
}

export enum Filter {
    DATE_ASC,
    DATE_DSC, // default
    PRICE_ASC,
    PRICE_DSC,
}