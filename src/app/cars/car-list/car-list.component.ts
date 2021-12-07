import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, HostListener, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car.service';
import { Car, ICar } from '../shared/models/car';
import { CarListService } from '../shared/services/car-list.service';


@Component({
    selector: 'app-car-list',
    templateUrl: '/car-list.component.html',
    styleUrls: ['./car-list.component.css']
})

export class CarListComponent implements OnInit {

    public title = 'Liste d\'enchères';
    public showBadge: boolean = true;
    private _carFilter = ''; // _ => private
    public filteredCars: ICar[] = [];
    public errMsg: string = '';
    public cars: any[] = [];

    // Store latest document
    public latestDoc = null;

    // Infinit scroll
    public scroll = true;

    constructor(private carListService: CarListService, public car: CarService) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {

        this.car.getAllCar(this.latestDoc).subscribe(querySnapshot => {

            querySnapshot.docs.forEach(doc => {

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
                        console.log(result);
                        if (i == 0) {
                            console.log("now");
                        } // hide loading component when i == 0 is loaded
                        car.imageUrls[i] = result;
                    })
                };

                this.cars.push(car);

            });


            // Update lastestDoc
            this.latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            // Unattach event listener if no more docs
            if (querySnapshot.empty) {
                console.log("empty");
                this.scroll = false;
                //window.removeEventListener('scroll', this.onScrollEvent.bind(this));
            }

            this.filteredCars = this.cars;

        });



        /* this.carListService.getCars().subscribe({
            next: cars => {
                this.cars = cars; // asynchrone, on reçoit d'abord toutes les valeurs
                this.filteredCars = this.cars;
            },
            error: err => this.errMsg = err
        }); */



    }

    loadMore() {
        this.load();
    }


    public changeBadge(): void {
        this.showBadge = !this.showBadge;
    }

    public get carFilter(): string {
        return this._carFilter;
    }

    public set carFilter(filter: string) {
        this._carFilter = filter;
        this.filteredCars = this.carFilter ? this.filterCars(this.carFilter) : this.cars; // si this.carFilter reçoit un valeur = this.filterCars(this.carFilter)

        if (this.type != 0) {
            this.filteredCars = this.typeFilter(this.filteredCars); // (voir explications fin du fichier .ts) 
        }
    }


    private filterCars(filtre: string): ICar[] {
        filtre = filtre.toLocaleLowerCase();

        const res = this.cars.filter(
            (car: ICar) => car.brand.toLocaleLowerCase().indexOf(filtre) != -1
        );

        return res;

    }

    /*
    Explications: 
    On doit gérer le cas (1) : l'utilisateur appuie d'abord sur une section (autos ou motos), puis filtre par nom,
    et le cas (2) : l'utilisateur filtre d'abord par nom, puis appuie sur une séction (autos ou motos)

    Cas 1 : * l'utilisateur appuie sur une section *
            - On change la valeur de type avec setType()
            - On filtre this.filteredCars avec carFilter()

    Cas 2 : - On filtre this.filteredCars avec carFilter()
                * l'utilisateur appuie sur une section *
            - On change la valeur de type avec setType()
            - On re-filtre this.filteredCars pour n'afficher que les autos ou motos qui correspondent avec typeFilter()

    A REFAIRE

     */

    private type: number = 0;

    setType(numb: number) {

        if (this.type == 1 || this.type == 2) {
            this.filteredCars = this.cars;
        }

        this.type = numb;
        this.filteredCars = this.typeFilter(this.filteredCars); // utile uniquement dans le cas (2) ou on filtre avant d'appuyer

    }

    private typeFilter(filteredCars: ICar[]): ICar[] {
        if (this.type == 1) {
            const res = this.filteredCars.filter(
                (car: ICar) => car.type.indexOf("auto") != -1
            );

            return res;

        } else if (this.type == 2) {
            const res = this.filteredCars.filter(
                (car: ICar) => car.type.indexOf("moto") != -1
            );

            return res;
        }

        return this.cars;

    }

    // Load more docs scroll
    onScrollEvent() {
        if (this.scroll == true) {
            this.loadMore();
        }
    }

}