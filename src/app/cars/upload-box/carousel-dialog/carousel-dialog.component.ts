import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-carousel-dialog',
  templateUrl: './carousel-dialog.component.html',
  styleUrls: ['./carousel-dialog.component.css']
})
export class CarouselDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef:
  MatDialogRef<CarouselDialogComponent>) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
