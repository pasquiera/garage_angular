import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  comment;
  path;

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage) {
  }

  getComments() {
    return this.afs.collectionGroup('main-comments', ref => ref.where('car-id', '==', 'bLDpF7Bv3Uff5tRLXKRKo1fCmni2')).get();
  }

  getReplies() {
    return this.afs.collectionGroup('replies', ref => ref.where('prev', '==', '9sBBAAgPTOBQyt51Qxjw')).get();
  }

}
