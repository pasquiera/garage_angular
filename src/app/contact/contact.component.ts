import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(public utility: UtilityService) { }

  ngOnInit(): void {
  }

  sendMessage(InputName: HTMLInputElement, InputEmail: HTMLInputElement, InputText: HTMLTextAreaElement) {
    // contact form in FAQ
    let name = InputName.value;
    let email = InputEmail.value;
    let text = InputText.value;

    if (name == '' || email == '' || text == '') {
      if (name == '') {
        document.getElementById('name').classList.add('invalid');
      }

      if (email == '') {
        document.getElementById('email').classList.add('invalid');
      }

      if (text == '') {
        document.getElementById('text').classList.add('invalid');
      }
    } else {
      this.utility.contactMessage(name, email, text);
      document.getElementById('name').classList.remove('invalid');
      document.getElementById('email').classList.remove('invalid');
      document.getElementById('text').classList.remove('invalid');

      (document.getElementById('name') as HTMLInputElement).value = '';
      (document.getElementById('email') as HTMLInputElement).value = '';
      (document.getElementById('text') as HTMLTextAreaElement).value = '';

      Swal.fire({
        title: 'Message envoyé',
        icon: 'success',
        confirmButtonColor:'#1983CC',
      });
    }

  }

}
