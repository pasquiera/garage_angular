import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { IUserDocument } from 'src/app/shared/models/userDocument';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {

  public profileForm: FormGroup;

  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userDocument: IUserDocument;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      profileSurname: [''],
      profileName: [''],
      profileUserName: ['', [Validators.required]],
      profileEmail: [''],
      profileAddress: [''],
      profilePhoneNumber: ['']
    });

    this.getUserInfo();

  }

  updateUserName(): void {
    if (this.profileForm.valid) {
      this.firestore.update(
        {
          path: ["Users", this.auth.getAuth().currentUser!.uid], // uid firebase
          data: {
            surname: this.profileForm.get('profileSurname').value,
            name: this.profileForm.get('profileName').value,
            userName: this.profileForm.get('profileUserName').value,
            address: this.profileForm.get('profileAddress').value,
            phoneNumber: this.profileForm.get('profilePhoneNumber').value,
          },
        });
    }
  }

  getUserInfo(): void {

    this.firestore.getDocument(
      {
        path: ["Users", this.auth.getAuth().currentUser!.uid],
        onComplete: (result) => {
          this.userDocument = <IUserDocument>result.data();
          this.profileForm.patchValue({
            profileSurname: this.userDocument.surname,
            profileName: this.userDocument.name,
            profileUserName: this.userDocument.userName,
            profileAddress: this.userDocument.address,
            profilePhoneNumber: this.userDocument.phoneNumber
          })
        }
      }
    );
  }

}
