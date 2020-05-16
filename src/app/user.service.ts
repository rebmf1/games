import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './user.model';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Player } from './player.model';
import { ɵallowPreviousPlayerStylesMerge } from '@angular/animations/browser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserId: string;
  private currentUser: Subject<User> = new Subject<User>();

  constructor(private firestore: AngularFirestore) { }

  login(userId: string): void {
    this.currentUserId = userId;
    this.getUser(this.currentUserId).subscribe(user => this.currentUser.next(user));
  }

  subscribeToCurrentUser(): Subject<User> {
    return this.currentUser;
  }

  addNewUser(name: string) {
    return this.firestore.collection('users').add({ name: name, namesSubmitted: 0 }).then(doc =>
      this.login(doc.id));
  }

  getCurrentUserId(): string {
    return this.currentUserId;
  }

  getUser(userId: string): Observable<User> {
    return this.firestore.collection<User>('users').doc<User>(userId).valueChanges();
  }

  joinGame(gameId: string, user: User): void {
    this.firestore.collection('users').doc(this.currentUserId).update({
      currentGameId: gameId
    });
    this.firestore.collection('games').doc(gameId).collection('players').doc(this.currentUserId).set({
      name: user.name,
      namesSubmitted: 0,
      teamName: null,
      score: 0,
      sequence: null
    });
  }

  leaveGame(): void {
    this.firestore.collection('users').doc(this.currentUserId).update({ currentGameId: null });
  }

  getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges({ idField: 'id' });
  }

  removeAllPlayers(players: Player[]) {
    players.forEach(p =>
      this.firestore.collection('users').doc(p.id).update({
        currentGameId: null
      }));
  }
}
