import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage(InputName: HTMLInputElement, InputEmail: HTMLInputElement, InputText: HTMLTextAreaElement) {
    let name = InputName.value;
    let email = InputEmail.value;
    let text = InputText.value;

    console.log(name)
    console.log(email)
    console.log(text)
  }

}
