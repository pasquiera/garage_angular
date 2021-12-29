import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { CarService } from "src/app/services/car.service";

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit {

  private subscription: Subscription[];
  public carForm: FormGroup;
  imgName: string[];
  words = 0;
  carID: string;
  state = CarEditCompState.CREATE;
  error: string[];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, public car: CarService) { }


  ngOnInit(): void {

    this.subscription = [];
    this.imgName = [];

    // initialize reactive form
    this.carForm = this.fb.group({
      carType: [null],
      brand: ['', Validators.required],
      consumption: [''],
      description: [''],
      engine: [''],
      fuel: [null],
      gearbox: [null],
      hp: [null],
      mileage: [null],
      model: [null],
      price: [null, { disabled: this.isEditState }],
      year: [null],
      carImage: [null],
    });


    this.subscription[0] = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.carID = params['id'];
        this.getCarInfo();
        this.state = CarEditCompState.EDIT;
      }
    });

  }

  isValid(): boolean {

    this.error = [];

    if (document.querySelector('input[formControlName = "carType"]:checked') == null) {
      this.error.push("Type du véhicule");
    }

    if (this.carForm.get('brand').invalid) {
      this.error.push("Marque");
    }

    if (this.carForm.get('model').invalid) {
      this.error.push("Modèle");
    }

    if (this.carForm.get('year').invalid) {
      this.error.push("Année");
    }

    if (this.carForm.get('mileage').invalid) {
      this.error.push("Kilométrage");
    }

    if (this.carForm.get('engine').invalid) {
      this.error.push("Moteur");
    }

    if (this.carForm.get('hp').invalid) {
      this.error.push("Puissance");
    }

    if (document.querySelector('input[formControlName = "fuel"]:checked') == null) {
      this.error.push("Energie");
    }

    if (this.carForm.get('consumption').invalid) {
      this.error.push("Consommation");
    }

    if (document.querySelector('input[formControlName = "gearbox"]:checked') == null) {
      this.error.push("Boite de vitesse");
    }

    if (this.carForm.get('price').invalid) {
      this.error.push("Prix de réserve");
    }

    if (this.carForm.get('description').invalid) {
      this.error.push("Description");
    }

    if (this.carForm.get('carImage').invalid) {
      this.error.push("Photos du véhicule");
    }


    if (this.error.length != 0) {
      console.log(this.error);
      document.getElementById('alert').hidden = false;;
      return false;
    }

    return true;

  }

  closeError() {
    document.getElementById('alert').hidden = true;
  }

  async getCarInfo() {
    //this.subscription[1]
    await this.car.getCar(this.carID).subscribe(res => {
      this.carForm.patchValue({
        carType: res.type,
        brand: res.brand,
        consumption: res.consumption,
        description: res.description,
        engine: res.engine,
        fuel: res.fuel,
        gearbox: res.gearbox,
        hp: res.hp,
        mileage: res.mileage,
        model: res.model,
        price: res.price,
        year: res.year,
      })

      this.getCarImages(res.imageUrls)

    })
  }

  async getCarImages(imagePath: string[]) {
    var files = new Array(imagePath.length);
    for (let i = 0; i < files.length; i++) {
      await this.car.getImage(imagePath[i]).then(url => {
        var pos1 = imagePath[i].indexOf("/");
        var pos2 = imagePath[i].indexOf("/", pos1 + 1);
        var strOut = imagePath[i].substr(pos2 + 1);
        files[i] = [strOut, url];
        this.imgName[i] = strOut;
      });
    }

    this.carForm.patchValue({
      carImage: files
    })

  }

  editCar() {
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
      let year = this.carForm.get('year').value;

      this.car.updateCar(this.carID, type, brand,
        consumption, description, engine,
        fuel, gearbox, hp,
        mileage, model, year,
        image, this.imgName);

    } else {
      this.isValid();
    }
  }

  createCar() {
    // create firebase car data with form control values
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

      this.car.createCar(type, brand, consumption,
        description, engine, fuel,
        gearbox, hp, mileage,
        model, price, year,
        image, this.imgName);

    }
  }

  receiveName($event) {
    // get car pictures url from UploadBoxComponent 
    this.imgName = $event;
  }

  onKey(event: any) {
    // word counter
    var spaces = event.target.value.match(/\S+/g);
    this.words = spaces ? spaces.length : 0;
    console.log(this.words);
  }

  /* Progress bar functions */

  next1Click() {
    document.getElementById('page1').style.display = 'none';

    document.getElementById('uncompleted').style.backgroundColor = '#000';
    document.getElementById('uncompleted').style.zIndex = '0';

    document.getElementById('icon').style.color = '#fff';

  }

  back1Click() {
    document.getElementById('page1').style.display = 'block';

    document.getElementById('uncompleted').style.backgroundColor = '#fff';
    document.getElementById('uncompleted').style.zIndex = '1';

    document.getElementById('icon').style.color = '#fff';
  }

  next2Click() {
    document.getElementById('page2').style.display = 'none';

    document.getElementById('uncompleted2').style.backgroundColor = '#000';
    document.getElementById('uncompleted2').style.zIndex = '0';

    document.getElementById('icon2').style.color = '#fff';
  }

  back2Click() {
    document.getElementById('page2').style.display = 'block';

    document.getElementById('uncompleted2').style.backgroundColor = '#fff';
    document.getElementById('uncompleted2').style.zIndex = '1';

    document.getElementById('icon2').style.color = '#fff';
  }

  ngOnDestroy() {

  }

  /* check current state */

  isCreateState() {
    return this.state == CarEditCompState.CREATE;
  }

  isEditState() {
    return this.state == CarEditCompState.EDIT;
  }

}

export enum CarEditCompState {
  CREATE,
  EDIT,
}

