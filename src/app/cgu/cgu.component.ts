import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.css']
})
export class CguComponent implements OnInit {

  title;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.title == 'cgu'){
      this.title = "CONDITIONS D'UTILISATION"
    } else {
      this.title = "POLITIQUE DE CONFIDENTIALITÉ DE HEROCAR"
    }
  }

}
