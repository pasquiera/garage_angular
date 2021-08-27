import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ElementRef, HostListener, Output, EventEmitter, } from '@angular/core';
import { CarouselDialogComponent } from '../carousel-dialog/carousel-dialog.component';

@Component({
  selector: 'app-upload-box',
  templateUrl: './upload-box.component.html',
  styleUrls: ['./upload-box.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UploadBoxComponent,
      multi: true
    }
  ]
})
export class UploadBoxComponent implements OnInit, ControlValueAccessor {

  onChange: Function;
  selectedFiles: any[] = [];
  imageURL: any[] = [];
  imageName: string[] = [];

  @Output() imageEvent = new EventEmitter<string[]>();

  constructor(private dialog: MatDialog) { }

  async selectFiles(event) {

    let files: any[] = [];

    Array.from(event.target.files).forEach(file => { files.push(file) });

    for (let i = 0; i < files.length; i++) {
      await this.readFile(files[i]).then(value => {
        this.imageURL.push(value);
        this.imageName.push(files[i].name);
        this.selectedFiles.push(files[i]);
      })
    }

    this.onChange(this.selectedFiles);
    this.emitFileName();
    
    event.target.value = '';

  }

  writeValue(obj: any): void {
    // called when the formControl is instantiated
    // when the formControl value changes (patch)
  }

  registerOnChange(onChange: any): void {
    // called whenever the value changes
    // report new value back to the parent form
    this.onChange = onChange;
  }

  emitFileName(): void {
    this.imageEvent.emit(this.imageName);
    console.log(this.imageName);
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  readFile(file: File) {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      // (async) triggered each time the reading operation is successfully completed.
      reader.onload = (e) => {
        resolve(e.target.result as string);
      }

      // starts reading the contents of the specified Blob
      reader.readAsDataURL(file);
    });

  }

  show(): void {
    for (let i = 0; i < this.imageURL.length; i++) {
      console.log(this.imageName[i]);
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imageName.splice(index, 1);
    this.imageURL.splice(index, 1);
    this.emitFileName();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedFiles, event.previousIndex, event.currentIndex);
    moveItemInArray(this.imageName, event.previousIndex, event.currentIndex);
    moveItemInArray(this.imageURL, event.previousIndex, event.currentIndex);
    this.emitFileName();
  }

  openDialog(index: number) {
    this.dialog.open(CarouselDialogComponent,
      {
        data: {
          imageURL: this.imageURL,
          index: index
        }
      });
  }

  ngOnInit(): void {
  }

}
