import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

  @ViewChild('image', {static: false})
  public imageSource: string;

  public imageDestination: string;
  private cropper: Cropper;

  constructor() { }

  ngOnInit(): void {
  }

}
