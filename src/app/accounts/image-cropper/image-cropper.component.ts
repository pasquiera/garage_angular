import { Component, OnInit, Inject } from '@angular/core';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

  croppedImage: any = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef:
    MatDialogRef<ImageCropperComponent>) { }

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  upload() {
    this.dialogRef.close(this.croppedImage)
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
