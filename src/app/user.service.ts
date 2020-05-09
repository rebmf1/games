import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserId: string;

  constructor(private firestore: AngularFirestore, private router: Router) { }

  login(userId: string): void {
    this.currentUserId = userId;
  }

  addNewUser(name: string) {
    return this.firestore.collection('users').add({ name: name, namesSubmitted: 0 }).then(doc => this.login(doc.id));
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  getCurrentUser(): Observable<User> {
    if (!this.currentUserId) {
      return of(null);
    }
    return this.getUser(this.currentUserId);
  }

  getUser(userId: string): Observable<User> {
    return this.firestore.collection<User>('users').doc<User>(userId).valueChanges();
  }

  joinGame(gameId: string): void {
    this.firestore.collection('games').doc(gameId).collection('teams').get()
      .subscribe(teams => {
        let team = teams.docs.reduce((prev, current) => prev.data().size > current.data().size ? current : prev);
        this.firestore.collection('users').doc(this.currentUserId).update({
          currentGameId: gameId,
          namesSubmitted: 0,
          teamId: team.id,
          teamName: team.data().name,
          score: 0,
          sequence: (team.data().size + 1) * team.data().sequence
        });
        this.firestore.collection('games').doc(gameId).collection('teams').doc(team.id).update({ size: team.data().size + 1 });
      });
  }

  leaveGame(): void {
    this.firestore.collection('users').doc(this.currentUserId).update({ currentGameId: null, namesSubmitted: 0, teamId: null, teamName: null, score: 0 });
  }

  incrementNameCount() {
    this.firestore.collection<User>('users').doc<User>(this.currentUserId).get()
      .subscribe(user =>
        this.firestore.collection('users').doc(this.currentUserId).update({ namesSubmitted: user.data().namesSubmitted + 1 }));
  }

  getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges({ idField: 'id' });
  }

  incrementScore() {
    this.firestore.collection<User>('users').doc<User>(this.currentUserId).get()
      .subscribe(user => {
        this.firestore.collection('users').doc(this.currentUserId).update({ score: user.data().score + 1 });
        this.firestore.collection('games').doc(user.data().currentGameId).collection('teams').doc(user.data().teamId).get()
          .subscribe(team => this.firestore.collection('games').doc(user.data().currentGameId).collection('teams').doc(user.data().teamId).update({ score: team.data().score + 1 }));
      });
  }
}
