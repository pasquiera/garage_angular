import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "src/app/services/auth.service";
import { CarService } from "src/app/services/car.service";

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {

  public carForm: FormGroup;
  imgName: string[];

  constructor(private fb: FormBuilder, public car: CarService) { }

  
  ngOnInit(): void {
    this.carForm = this.fb.group({
      carBrand: [''],
      carImage: [null],
    });
  }

  receiveName($event) {
    this.imgName = $event;
  }

  createCar(){
    if (this.carForm.valid) {
      let brand = this.carForm.get('carBrand').value;
      let image = this.carForm.get('carImage').value;
      this.car.createCar(brand, image, this.imgName);
    }
  }

}
