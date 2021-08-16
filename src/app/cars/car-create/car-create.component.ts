import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-car-create',
  templateUrl: './car-create.component.html',
  styleUrls: ['./car-create.component.css']
})
export class CarCreateComponent implements OnInit {

  selectedFiles: FileList;
  imageURL: string[] = [];

  constructor() { }

  selectFiles(event) {

    this.selectedFiles = event.target.files;
    this.preview(this.selectedFiles);
    event.target.value = '';
  }

  preview(selectedFiles: FileList) {

    for (let i = 0; i < selectedFiles.length; i++) {

      const reader = new FileReader();

      // triggered each time the reading operation is successfully completed.
      reader.onload = () => {
        this.imageURL.push(reader.result as string);
      }

      // starts reading the contents of the specified Blob
      reader.readAsDataURL(selectedFiles[i]);
    }

  }

  show() {
    for (let i = 0; i < this.imageURL.length; i++) {
      console.log(this.imageURL[i]);
    }
  }

  removeImage(index: number){
    this.imageURL.splice(index, 1);
  }

  ngOnInit(): void {
  }

}
