import { Component, OnInit } from '@angular/core';
import { ICar } from '../shared/models/car';
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
    public cars: ICar[] = [];


    constructor(private carListService: CarListService) { }

    ngOnInit(): void {
        this.carListService.getCars().subscribe({
            next: cars => {
                this.cars = cars; // asynchrone, on reçoit d'abord toutes les valeurs
                this.filteredCars = this.cars;
            },
            error: err => this.errMsg = err
        });


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
            (car: ICar) => car.name.toLocaleLowerCase().indexOf(filtre) != -1
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

}