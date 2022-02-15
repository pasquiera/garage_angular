import { Component, OnInit } from '@angular/core';
import { CarouselDialogComponent } from '../cars/upload-box/carousel-dialog/carousel-dialog.component';
import { UtilityService } from '../services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  files: any = [];

  constructor(private dialog: MatDialog, public utility: UtilityService) { }

  ngOnInit(): void {
    this.files = new Array(9);

    for (let i = 0; i < this.files.length; i++) {
      this.utility.getImage(i + 1).then(res => {
        this.files[i] = res;
      })
    }
  }

  showAnswer(blockIndex: number) {
    let block = document.getElementById('block' + blockIndex);
    block.classList.toggle('active');
  }

  openDialog(index: number) {
    // open CarouselDialogComponent to show an image
    this.dialog.open(CarouselDialogComponent,
      {
        // NoopScrollStrategy: does nothing
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          imageURL: this.files,
          index: index,
        }
      });
  }

}
