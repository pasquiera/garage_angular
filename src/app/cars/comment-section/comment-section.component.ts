import { Component, OnInit } from '@angular/core';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AuthenticatorComponent } from 'src/app/accounts/authenticator/authenticator.component';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ActivatedRoute } from '@angular/router';

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

  carID: string;

  comments = new Array();
  replies = new Array();
  count: number = 0;

  index: number;

  constructor(private dialog: MatDialog, public auth: AuthService, private utility: UtilityService, public comment: CommentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // retrieve all comments and replies from firebase associated with the car ID
    this.carID = this.route.snapshot.paramMap.get('id');

    this.subscription = this.utility.getData().subscribe((data) => {
      this.avatar = data;
    });

    this.comment.getComments(this.carID).pipe(first()).subscribe(querySnapshot => {
      //first() end the subscription after the first event.
      querySnapshot.docs.forEach(doc => {
        let id = doc.get("uid");
        Promise.all([this.auth.getName(id), this.auth.getAvatar(id)]).then(data => {
          this.comments.push({ userName: data[0].get("userName"), avatar: data[1], text: doc.get("text"), id: doc.get("id") });
          this.count++;
        });
      });
    });

    this.comment.getReplies(this.carID).pipe(first()).subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        let id = doc.get("uid");
        Promise.all([this.auth.getName(id), this.auth.getAvatar(id)]).then(data => {
          this.replies.push({ userName: data[0].get("userName"), avatar: data[1], text: doc.get("text"), prev: doc.get("prev") });
          this.count++;
        });
      });
    });
  }

  toggleShow(index: number): void {
    // show/hide the reply input (only one is displayed at a time)
    if (this.index != index) {
      this.isShown = true;
      this.index = index;
    } else {
      this.isShown = !this.isShown;
    }
  }

  checkIndex(index: number): boolean {
    // check which comment needs to display the reply input
    return index == this.index;
  }

  async sendComment() {
    // send comment to firebase
    if (this.auth.isLoggedIn == false) {
      this.login();
    } else {
      const textarea = (<HTMLInputElement>document.getElementById("commentArea")).value;
      await this.comment.sendComment(this.carID, textarea).then(res => {
        // update comments array with the new comment
        Promise.all([this.auth.getName(this.auth.userID), this.auth.getAvatar(this.auth.userID)]).then(data => {
          this.comments.push({ userName: data[0].get("userName"), avatar: data[1], text: textarea, id: res });
          this.count++;
        });
      });
    }
  }

  sendReply(commentID: string, index: number): void {
    // send reply to firebase
    if (this.auth.isLoggedIn == false) {
      this.login();
    } else {
      const textarea = (<HTMLInputElement>document.getElementById("replyArea" + index)).value;
      this.comment.sendReply(this.carID, commentID, textarea);

      // update replies array with the new reply
      Promise.all([this.auth.getName(this.auth.userID), this.auth.getAvatar(this.auth.userID)]).then(data => {
        this.replies.push({ userName: data[0].get("userName"), avatar: data[1], text: textarea, prev: commentID });
        this.count++;
        this.toggleShow(index);
      });
    }
  }

  login(): void {
    // open AuthenticatorComponent if the user is not connected
    this.dialog.open(AuthenticatorComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      panelClass: 'custom-modalbox'
    });
  }

  ngOnDestroy(): void {
    console.log("destroyed");
    this.subscription.unsubscribe();
  }

}
