import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  comment;
  path;

  constructor(public afs: AngularFirestore, public storage: AngularFireStorage, public auth: AuthService) {
  }

  async sendComment(carID: string, comment: string): Promise<string> {
    const commentRef: AngularFirestoreCollection<any> = this.afs.collection(`comments`).doc(carID).collection(`main-comments`);
    let docID: string;

    var d = new Date(Date.now());

    await commentRef.add({
      carID: carID,
      id: null,
      text: comment,
      uid: this.auth.userID,
      date: d.toLocaleDateString(),
      dateMs: Date.now(),
    }).then(docRef => {
      this.afs.doc(`comments/${carID}/main-comments/${docRef.id}`).update({ id: docRef.id });
      docID = docRef.id;
    });

    return docID;
  }

  sendReply(carID: string, commentID: string, reply: string): void {
    const replyRef: AngularFirestoreCollection<any> = this.afs.collection(`comments`).doc(carID).collection(`main-comments`).doc(commentID).collection(`replies`);

    var d = new Date(Date.now());
    
    replyRef.add({
      carID: carID,
      prev: commentID,
      text: reply,
      uid: this.auth.userID,
      date: d.toLocaleDateString(),
      dateMs: Date.now(),
    })
  }

  getComments(carID: string) {
    return this.afs.collectionGroup('main-comments', ref => ref.where('carID', '==', carID).orderBy('dateMs')).get();
  }

  getReplies(carID: string) {
    return this.afs.collectionGroup('replies', ref => ref.where('carID', '==', carID).orderBy('dateMs')).get();
  }

}
