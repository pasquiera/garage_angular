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
    public showBadge: boolean = true;
    public filteredCars: ICar[] = [];
    public errMsg: string = '';
    public default: any[] = [];
    public latestDoc = null; // Store latest document
    state = TypeState.ALL;
    empty = false;
    carousel: any[] = [];

    constructor(public car: CarService) { }

    ngOnInit(): void {
        this.load();
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

    load(): void {
        let cars: ICar[] = [];
        this.car.getAllCar(this.latestDoc).subscribe(querySnapshot => {
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
        this.car.getAllCarAsc(null).subscribe(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                const car = {
                    id: doc.get("id"),
                    brand: doc.get("brand"),
                    model: doc.get("model"),
                    year: doc.get("year"),
                    imagePath: doc.get("imageUrls"), // Contain only image path
                    firstImage: null,
                    endDate: doc.get("endDate"),
                    bid: doc.get("bid"),
                }

                this.car.getImage(car.imagePath[0]).then(result => {
                    car.firstImage = result;
                })

                this.carousel.push(car);
            });
            console.log(this.carousel)
        });
    }

    loadCar(): void {
        let cars: ICar[] = [];
        this.car.getCarOnly(this.latestDoc).subscribe(querySnapshot => {
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

    loadBike(): void {
        let cars: ICar[] = [];
        this.car.getBikeOnly(this.latestDoc).subscribe(querySnapshot => {
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

    loadMore() {
        // when loadMore button is clicked
        if (!this.empty) {
            if (this.isAllState()) {
                this.load();
            } else if (this.isCarState()) {
                this.loadCar();
            } else if (this.isBikeState()) {
                this.loadBike();
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
        document.querySelector('.active').classList.toggle('active');
    }

    /* switch to the right state when filter is clicked */

    onAllClick() {
        // switch to all cars state
        this.state = TypeState.ALL;
        this.reset();
        document.getElementById("all_type").classList.add('active');
        this.load();
    }

    onCarClick() {
        // switch to car state
        this.state = TypeState.CAR;
        this.reset();
        document.getElementById("car_type").classList.add('active');
        this.loadCar();
    }

    onBikeClick() {
        // switch to bike state
        this.state = TypeState.BIKE;
        this.reset();
        document.getElementById("bike_type").classList.add('active');
        this.loadBike();
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
