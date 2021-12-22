import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
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
  selectedFiles: any[] = []; // contains files for parent form
  imageURL: any[] = []; // contains only urls for display purposes
  imageName: string[] = []; // contains only files names

  @Output() imageEvent = new EventEmitter<string[]>();

  constructor(private dialog: MatDialog) { }

  onDrop(event) {
    // upload function for drag and drop
    event.preventDefault();

    let files: any[] = [];

    Array.from(event.dataTransfer.files).forEach(file => { files.push(file) });
    this.loadFile(files);

    event.target.value = '';

  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  selectFiles(event) {
    // upload function for button click
    let files: any[] = [];

    Array.from(event.target.files).forEach(file => { files.push(file) });
    this.loadFile(files);

    event.target.value = '';

  }

  async loadFile(files: any) {
    // push all the files into array (selectedFiles) and send it to parent form
    for (let i = 0; i < files.length; i++) {
      await this.readFile(files[i]).then(value => {
        this.imageURL.push(value);
        this.imageName.push(files[i].name);
        this.selectedFiles.push(files[i]);
      })
    }
    this.emitFile();
  }

  writeValue(obj: any): void {
    // called when the formControl is instantiated
    // when the formControl value changes (patch)
    // writeValue only use for edit a car
    if (obj != null) {
      for (let i = 0; i < obj.length; i++) {
        // contains all files already in firebase
        this.imageName[i] = obj[i][0];
        this.imageURL[i] = obj[i][1];
        this.selectedFiles[i] = null;
      }
    }
  }

  registerOnChange(onChange: any): void {
    // called whenever the value changes
    // report new value back to the parent form
    this.onChange = onChange;
  }

  emitFile(): void {
    // send files names to parent component
    this.imageEvent.emit(this.imageName);
    this.onChange(this.selectedFiles);
    console.log(this.selectedFiles);
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

  removeImage(index: number) {
    // remove image data from arrays when button click
    this.selectedFiles.splice(index, 1);
    this.imageName.splice(index, 1);
    this.imageURL.splice(index, 1);
    this.emitFile();
  }

  drop(event: CdkDragDrop<string[]>) {
    // drag and drop to change file position in arrays
    moveItemInArray(this.selectedFiles, event.previousIndex, event.currentIndex);
    moveItemInArray(this.imageName, event.previousIndex, event.currentIndex);
    moveItemInArray(this.imageURL, event.previousIndex, event.currentIndex);
    this.emitFile();
  }

  openDialog(index: number) {
    // open CarouselDialogComponent to show an image
    this.dialog.open(CarouselDialogComponent,
      {
        // NoopScrollStrategy: does nothing
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          imageURL: this.imageURL,
          index: index
        }
      });
  }

  isEmpty(): boolean {
    return this.selectedFiles.length == 0;
  }

  ngOnInit(): void {
  }

}
