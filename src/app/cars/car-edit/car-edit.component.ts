import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from "src/app/services/car.service";

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {

  public carForm: FormGroup;
  imgName: string[];
  words = 0;

  constructor(private fb: FormBuilder, public car: CarService) { }


  ngOnInit(): void {
    this.carForm = this.fb.group({
      carType: [null],
      brand: [''],
      consumption: [''],
      description: [''],
      engine: [''],
      fuel: [null],
      gearbox: [null],
      hp: [null],
      mileage: [null],
      model: [null],
      price: [null],
      year: [null],
      carImage: [null],
    });
  }

  receiveName($event) {
    this.imgName = $event;
  }

  createCar() {
    if (this.carForm.valid) {
      let type = this.carForm.get('carType').value;
      let brand = this.carForm.get('brand').value;
      let consumption = this.carForm.get('consumption').value;
      let description = this.carForm.get('description').value;
      let engine = this.carForm.get('engine').value;
      let fuel = this.carForm.get('fuel').value;
      let gearbox = this.carForm.get('gearbox').value;
      let hp = this.carForm.get('hp').value;
      let mileage = this.carForm.get('mileage').value;
      let image = this.carForm.get('carImage').value;
      let model = this.carForm.get('model').value;
      let price = this.carForm.get('price').value;
      let year = this.carForm.get('year').value;
      this.car.createCar(type, brand, consumption, description, engine, fuel, gearbox, hp, mileage, model, price, year, image, this.imgName);
    }
  }

  onKey(event: any) { 
    var spaces = event.target.value.match(/\S+/g);
    this.words = spaces ? spaces.length : 0;
    console.log(this.words);
  }

  /*
    Progress bar functions
  */

  next1Click() {
    document.getElementById('page1').style.display = 'none';

    document.getElementById('uncompleted').style.backgroundColor = '#000';
    document.getElementById('uncompleted').style.zIndex = '0';

    document.getElementById('icon').style.color='#fff';

  }

  back1Click() {
    document.getElementById('page1').style.display = 'block';

    document.getElementById('uncompleted').style.backgroundColor = '#fff';
    document.getElementById('uncompleted').style.zIndex = '1';

    document.getElementById('icon').style.color='#fff';
  }

  next2Click() {
    document.getElementById('page2').style.display = 'none';

    document.getElementById('uncompleted2').style.backgroundColor = '#000';
    document.getElementById('uncompleted2').style.zIndex = '0';

    document.getElementById('icon2').style.color='#fff';
  }

  back2Click() {
    document.getElementById('page2').style.display = 'block';

    document.getElementById('uncompleted2').style.backgroundColor = '#fff';
    document.getElementById('uncompleted2').style.zIndex = '1';

    document.getElementById('icon2').style.color='#fff';
  }


}
