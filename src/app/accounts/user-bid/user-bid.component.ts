import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-bid',
  templateUrl: './user-bid.component.html',
  styleUrls: ['./user-bid.component.css']
})
export class UserBidComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(Date.now() + 604800000)
  }

}
