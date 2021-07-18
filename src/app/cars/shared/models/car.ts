export interface ICar {
    id: number;
    type: string;
    name: string;
    year: number;
    description: string;
    price: number;
    imageUrls: string[];
    endDate: number;

}

export class Car implements ICar {
    constructor(
        public id: number,
        public type: string,
        public name: string,
        public year: number,
        public description: string,
        public price: number,
        public imageUrls: string[],
        public endDate: number,

    ) {}

}