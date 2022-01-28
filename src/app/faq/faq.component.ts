import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(public utility: UtilityService) { }

  ngOnInit(): void {
  }

  showAnswer(blockIndex: number) {
    let block = document.getElementById('block' + blockIndex);
    block.classList.toggle('active');
  }

}
