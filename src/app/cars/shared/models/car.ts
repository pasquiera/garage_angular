export interface ICar {
    owner: string
    id: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    fuel: string;
    gearbox: string;
    engine: string;
    hp: number;
    consumption: number;
    price: number;
    description: string;
    imageUrls: string[];
    endDate: number;
    bid: number;
    bid_Dsc: number;
    createDateAsc: number,
    buyer: string,
}

export class Car implements ICar {
    constructor(

        public owner: string,
        public id: string,
        public type: string,
        public brand: string,
        public model: string,
        public year: number,
        public mileage: number,
        public fuel: string,
        public gearbox: string,
        public engine: string,
        public hp: number,
        public consumption: number,
        public price: number,
        public description: string,
        public imageUrls: string[],
        public endDate: number,
        public bid: number,
        public bid_Dsc: number,
        public createDateAsc: number,
        public buyer: string,
    ) { }

}