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
    this.carID = this.route.snapshot.paramMap.get('id');

    this.subscription = this.utility.getData().subscribe((data) => {
      console.log(data);
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
    // show/hide the reply input (only one display at a time)
    if (this.index != index) {
      this.isShown = true;
      this.index = index;
    } else {
      this.isShown = !this.isShown;
    }
  }

  checkIndex(index: number): boolean {
    // check which comment need to display the reply input
    return index == this.index;
  }

  sendComment(): void {
    if (this.auth.isLoggedIn == false) {
      this.login();
    } else {
      const textarea = (<HTMLInputElement>document.getElementById("commentArea")).value;
      this.comment.sendComment(this.carID, textarea);
    }
  }

  sendReply(commentID: string, index: number): void {
    if (this.auth.isLoggedIn == false) {
      this.login();
    } else {
      const textarea = (<HTMLInputElement>document.getElementById("replyArea" + index)).value;
      console.log(commentID);
      this.comment.sendReply(this.carID, commentID, textarea);
    }
  }

  login(): void {
    this.dialog.open(AuthenticatorComponent, {
      // NoopScrollStrategy: does nothing
      scrollStrategy: new NoopScrollStrategy(),
      panelClass: 'custom-modalbox'
    });
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
