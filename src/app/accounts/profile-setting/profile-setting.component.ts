import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/user';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {

  public profileForm: FormGroup;

  user: IUser;
  img: string;

  constructor(private fb: FormBuilder, public auth: AuthService) {
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      profileImage: [null],
      profileSurname: [''],
      profileName: [''],
      profileUserName: ['', [Validators.required]],
      profileEmail: [''],
      profileAddress: [''],
      profilePhoneNumber: ['']
    });

    this.getUserInfo();
    this.getProfileImg();

  }

  updateUserName(): void {
    if (this.profileForm.valid) {
      let image = this.profileForm.get('profileImage').value;
      let surname = this.profileForm.get('profileSurname').value;
      let name = this.profileForm.get('profileName').value;
      let userName = this.profileForm.get('profileUserName').value;
      let address = this.profileForm.get('profileAddress').value;
      let phoneNumber = this.profileForm.get('profilePhoneNumber').value;

      this.auth.updateDocument(surname, name, userName, address, phoneNumber);

      if (image != null) {
        this.auth.uploadImage(image).then(() => {
          this.getProfileImg();
        });
      }

    }
  }

  getProfileImg(): void {
    this.auth.getUserImage().then(val => {
      this.img = val;
      console.log(this.img);
    })
  }

  getUserInfo(): void {

    this.auth.getUserData().subscribe(val => {
      this.profileForm.patchValue({
        profileSurname: val.surname,
        profileName: val.name,
        profileUserName: val.userName,
        profileAddress: val.address,
        profilePhoneNumber: val.phoneNumber
      })
    })

  }

}
