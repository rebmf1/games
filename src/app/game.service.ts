import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from './game.model';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { Name } from './name.model';
import { Team } from './team.model';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private firestore: AngularFirestore) {

  }

  getGames(): Observable<Game[]> {
    return this.firestore.collection<Game>('games').valueChanges({ idField: 'id' });
  }

  getGame(gameId: string): Observable<Game> {
    return this.firestore.collection<Game>('games').doc<Game>(gameId).valueChanges();
  }

  createGame(game: Game) {
    return this.firestore.collection('games').add(game);
  }

  createTeams(gameId: string, numberOfTeams: number) {
    for (let i = 1; i <= numberOfTeams; i++) {
      this.firestore.collection('games').doc(gameId).collection('teams').add({
        name: `Team ${i}`,
        size: 0,
        sequence: i,
        score: 0
      });
    }
  }

  teams(gameId: string): Observable<Team[]> {
    return this.firestore.collection('games').doc(gameId).collection<Team>('teams').valueChanges();
  }

  updateGame(game: Game) {
    delete game.id;
    this.firestore.doc('games/' + game.id).update(game);
  }

  deleteGame(gameId: string) {
    this.firestore.doc('games/' + gameId).delete();
  }

  getPlayers(gameId: string): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => ref.where('currentGameId', '==', gameId)).valueChanges({ idField: 'id' });
  }

  addName(gameId: string, name: Name): void {
    this.firestore.collection('games').doc(gameId).collection('names').add({ value: name });
  }

  names(gameId): Observable<Name[]> {
    return this.firestore.collection('games').doc(gameId).collection<Name>('names').valueChanges({ idField: 'id' });
  }

  namesThisRound(gameId): Observable<Name[]> {
    return this.firestore.collection('games').doc(gameId).collection<Name>('namesThisRound').valueChanges({ idField: 'id' });
  }

  startGame(gameId: string) {
    this.shuffleNames(gameId);
    this.updateGameState(gameId, 'IN PROGRESS');
    this.firestore.collection('users', ref => ref.where('currentGameId', '==', gameId)
      .where('sequence', '==', 1))
      .get()
      .subscribe(user => this.firestore.collection('games').doc(gameId).update({
        currentUserTurnId: user.docs[0].id,
        currentUserTurnName: user.docs[0].data().name
      }));
  }

  nextPlayer(gameId: string, currentSequence: number) {
    this.firestore.collection('users', ref => ref.where('currentGameId', '==', gameId)
      .where('sequence', '==', currentSequence + 1))
      .get()
      .subscribe(user => this.firestore.collection('games').doc(gameId).update({
        currentUserTurnId: user.docs[0].id,
        currentUserTurnName: user.docs[0].data().name,
        roundEnd: null
      }));
  }

  shuffleNames(gameId: string) {
    this.firestore.collection('games').doc(gameId).collection('names').get()
      .subscribe(names => {
        let shuffledNames = this.shuffle(names.docs);
        for (let i = 0; i < shuffledNames.length; i++) {
          this.firestore.collection('games').doc(gameId).collection('names').doc(shuffledNames[i].id).update({ sequence: i });
        }
      });
  }

  nextRound(gameId: string, currentRound: number) {
    if (currentRound === 3) {
      this.updateGameState(gameId, 'COMPLETED');
    } else {
      this.firestore.collection('games').doc(gameId).update({ currentRound: currentRound + 1, roundEnd: null });
      this.firestore.collection('games').doc(gameId).collection('namesThisRound').get()
        .subscribe(names => names.docs.forEach(n => this.firestore.collection('games').doc(gameId).collection('namesThisRound').doc(n.id).delete()));
      this.shuffleNames(gameId);
    }
  }

  startRound(gameId: string, roundLength: number) {
    this.firestore.collection('games').doc(gameId).update({ roundEnd: Date.now() + (roundLength * 1000) })
  }

  cancelGame(gameId: string) {
    this.updateGameState(gameId, 'CANCELLED');
    this.firestore.collection<User>('users', ref => ref.where('currentGameId', '==', gameId)).get()
      .subscribe(users => users.docs.forEach(user =>
        this.firestore.collection('users').doc(user.id).update({ currentGameId: null })));
  }

  getTeam(gameId: string, teamId: string): Observable<Team> {
    return this.firestore.collection('games').doc(gameId).collection('teams').doc<Team>(teamId).valueChanges();
  }

  markNameGuessed(gameId: string, name: Name) {
    return this.firestore.collection('games').doc(gameId).collection('namesThisRound').doc(name.id).set({ value: name.value });
  }

  private updateGameState(gameId: string, state: string) {
    this.firestore.collection('games').doc(gameId).update({ state: state });
  }

  private shuffle(array: any[]): any[] {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
