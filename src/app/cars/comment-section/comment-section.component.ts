import { Component, OnInit } from '@angular/core';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AuthenticatorComponent } from 'src/app/accounts/authenticator/authenticator.component';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {

  isShown: boolean = false;
  userName: string = "null";
  avatar: string;
  subscription;

  comments = new Array();
  replies = new Array();
  count: number = 0;

  constructor(private dialog: MatDialog, public auth: AuthService, private utility: UtilityService, public comment: CommentService) { }

  ngOnInit(): void {
    console.log("initialised");
    this.subscription = this.utility.getData().subscribe((data) => {
      console.log(data);
      this.avatar = data;
    });

    this.comment.getComments().pipe(first()).subscribe(querySnapshot => {
      //first() end the subscription after the first event.
      querySnapshot.docs.forEach(doc => {
        let id = doc.get("uid");
        Promise.all([this.auth.getName(id), this.auth.getAvatar(id)]).then(data => {
          this.comments.push({ userName: data[0].get("userName"), avatar: data[1], text: doc.get("text"), id: doc.get("id") });
          this.count++;
        });
      });
    });

    this.comment.getReplies().pipe(first()).subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        let id = doc.get("uid");
        Promise.all([this.auth.getName(id), this.auth.getAvatar(id)]).then(data => {
          this.replies.push({ userName: data[0].get("userName"), avatar: data[1], text: doc.get("text"), prev: doc.get("prev") });
          this.count++;
        });
      });
    });
  }

  toggleShow(): void {
    this.isShown = !this.isShown;
  }

  sendComment(): void {

    if (this.auth.isLoggedIn == false) {
      this.dialog.open(AuthenticatorComponent, {
        // NoopScrollStrategy: does nothing
        scrollStrategy: new NoopScrollStrategy(),
        panelClass: 'custom-modalbox'
      });
    } else {
      console.log("Comment posted");
    }

  }

  ngOnDestroy(): void {
    console.log("destroyed");
    this.subscription.unsubscribe();
    /* this.comments = [];
    this.replies = [];
    this.count = 0; */
  }

  /*  ngAfterViewInit() {
     const textarea = document.querySelector("textarea");
     textarea.addEventListener("keyup", e => {
       textarea.style.height = "20px";
       let scHeight = (e.target as HTMLInputElement).scrollHeight;
       textarea.style.height = `${scHeight}px`;
     });
   } */

}
