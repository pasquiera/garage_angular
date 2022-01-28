import { Component, ElementRef, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})

export class FileUploadComponent implements OnInit, ControlValueAccessor {

  onChange: Function;
  imageURL: string;
  fileToUpload: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @Output() imageEvent = new EventEmitter<string>();

  selectFile(event) {
    // listen for file upload and open ImageCropperComponent
    this.imageChangedEvent = event;

    const dialogRef = this.dialog.open(ImageCropperComponent,
      {
        // NoopScrollStrategy: does nothing
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          imageChangedEvent: this.imageChangedEvent,
        }
      });

    dialogRef.afterClosed().subscribe(async result => {
      // get image from ImageCropperComponent and send it to parent form
      if (result != null) {
        let file = base64ToFile(result);
        this.onChange(file);

        // send image url to display new profile picture in parent component
        this.imageEvent.emit(result);
      }
        event.target.value = '';
    });

  }

  constructor(private host: ElementRef<HTMLInputElement>, private dialog: MatDialog) { }

  writeValue(value: null): void {
    // called when the formControl is instantiated
    // when the formControl value changes (patch)
    this.host.nativeElement.value = '';
  }

  registerOnChange(onChange: any): void {
    // called whenever the value changes
    // report new value back to the parent form
    this.onChange = onChange;
  }

  registerOnTouched(fn: any): void {
    // called whenever ths UI is interacted with, like a blur event
  }

  ngOnInit(): void { }

}
