import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showAnswer(blockIndex: number) {
    let block = document.getElementById('block' + blockIndex);
    block.classList.toggle('active');
  }

}
