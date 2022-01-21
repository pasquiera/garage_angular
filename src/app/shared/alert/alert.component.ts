import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(public utility: UtilityService) { }

  ngOnInit(): void {
    this.utility.getAlert().subscribe(val => {
      if (val == 1) {
        this.showSucces();
      } else if (val == 2) {
        this.showError();
      }
    })
  }

  showError() {
    const alert = document.getElementById('alert');
    alert.hidden = false;
    alert.classList.remove('hide');
    alert.classList.add('show');
    setTimeout(() => {
      this.closeError();
    }, 2000);
  }

  closeError() {
    this.utility.updateAlert(0);
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
    alert.classList.add('hide');
  }


  showSucces() {
    const success = document.getElementById('success');
    success.hidden = false;
    success.classList.remove('hide');
    success.classList.add('show');
    setTimeout(() => {
      this.closeSuccess();
    }, 2000);
  }

  closeSuccess() {
    this.utility.updateAlert(0);
    const success = document.getElementById('success');
    success.classList.remove('show');
    success.classList.add('hide');
  }

}
