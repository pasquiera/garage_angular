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
  imgURL: string;
  subscription;

  constructor(private fb: FormBuilder, public auth: AuthService) {
  }

  ngOnInit(): void {
    // initialize reactive form
    this.profileForm = this.fb.group({
      profileImage: [null],
      profileLastName: [''],
      profileFirstName: [''],
      profileUserName: ['', [Validators.required]],
      profileEmail: [''],
      profileAddress: [''],
      profilePhoneNumber: ['']
    });

    this.getUserInfo();

  }

  updateUserName(): void {
    // update firebase user data with form control values
    if (this.profileForm.valid) {
      let image = this.profileForm.get('profileImage').value;
      let lastName = this.profileForm.get('profileLastName').value;
      let firstName = this.profileForm.get('profileFirstName').value;
      let userName = this.profileForm.get('profileUserName').value;
      let address = this.profileForm.get('profileAddress').value;
      let phoneNumber = this.profileForm.get('profilePhoneNumber').value;

      this.auth.updateDocument(lastName, firstName, userName, address, phoneNumber);

      if (image != null) {
        this.auth.uploadImage(image);
      }

      // avoid image reupload for each submit
      this.profileForm.reset();

    }
  }

  getUserInfo(): void {
    // retrieve user data from firebase when component is intialized
    this.subscription = this.auth.getUserData().subscribe(val => {

      this.profileForm.patchValue({
        profileLastName: val.lastName,
        profileFirstName: val.firstName,
        profileUserName: val.userName,
        profileAddress: val.address,
        profilePhoneNumber: val.phoneNumber
      })

      this.getUserImage(val.imageProfile);

    })
  }

  getUserImage(path: string): void {
    // retrive user profile picture from firebase storage
    this.auth.getUserImage(path).then(val => {
      this.imgURL = val;
    })
  }


  receiveURL($event) {
    // get profile picture url from FileUploadComponent
    this.imgURL = $event;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log("done");
  }

}
