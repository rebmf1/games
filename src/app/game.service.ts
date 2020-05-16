import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from './game.model';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { Name } from './name.model';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Player } from './player.model';

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

  getPlayers(gameId: string): Observable<Player[]> {
    return this.firestore.collection('games').doc(gameId).collection<Player>('players').valueChanges({ idField: 'id' });
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

  startGame(gameId: string, players: Player[], numberOfTeams: number) {
    this.shuffleNames(gameId);
    this.updateGameState(gameId, 'IN PROGRESS');
    let teams: Player[][] = this.split(players, numberOfTeams);
    let sequence = 1;
    for (let i = 0; i < numberOfTeams; ++i) {
      let teamNumber = 1;
      for (let j = 0; j < teams[i].length; j++) {
        this.firestore.collection('games').doc(gameId).collection('players').doc(teams[i][j].id)
          .update({
            sequence: sequence,
            teamName: `Team ${teamNumber}`
          });
        if (sequence === 1) {
          this.firestore.collection('games').doc(gameId)
            .update({
              currentUserTurnId: teams[i][j].id,
              currentUserTurnName: teams[i][j].name
            });
        }
        sequence++;
        teamNumber++;
      }
    }
  }

  nextPlayer(gameId: string, nextSequence: number) {
    this.shuffleNames(gameId);
    this.firestore.collection('games').doc(gameId).collection('players', ref => ref.where('sequence', '==', nextSequence))
      .get()
      .subscribe(user => this.firestore.collection('games').doc(gameId).update({
        currentUserTurnId: user.docs[0].id,
        currentUserTurnName: user.docs[0].data().name,
        roundEnd: null,
        carryOverTime: null
      }));
  }

  setCarryOverTime(gameId: string, carryOverTime: number) {
    this.firestore.collection('games').doc(gameId).update({ carryOverTime: carryOverTime });
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
    this.firestore.collection('games').doc(gameId).update({ currentRound: currentRound + 1, roundEnd: null });
    this.firestore.collection('games').doc(gameId).collection('namesThisRound').get()
      .subscribe(names => names.docs.forEach(n => this.firestore.collection('games').doc(gameId).collection('namesThisRound').doc(n.id).delete()));
    this.shuffleNames(gameId);
  }

  startRound(gameId: string, roundLength: number) {
    this.firestore.collection('games').doc(gameId).update({ roundEnd: Date.now() + (roundLength * 1000), carryOverTime: null })
  }

  cancelGame(gameId: string) {
    this.updateGameState(gameId, 'CANCELLED');
  }

  markNameGuessed(gameId: string, name: Name) {
    return this.firestore.collection('games').doc(gameId).collection('namesThisRound').doc(name.id).set({ value: name.value });
  }

  updateGameState(gameId: string, state: string) {
    this.firestore.collection('games').doc(gameId).update({ state: state });
  }

  updateNamesSubmittedCount(gameId: string, playerId: string, newCount: number) {
    this.firestore.collection('games').doc(gameId).collection('players').doc(playerId).update({ namesSubmitted: newCount });
  }

  getPlayer(gameId: string, playerId: string): Observable<Player> {
    return this.firestore.collection('games').doc(gameId).collection('players').doc<Player>(playerId).valueChanges();
  }

  updateScore(gameId: string, playerId: string, newPlayerScore: number) {
    this.firestore.collection('games').doc(gameId).collection('players').doc(playerId).update({ score: newPlayerScore });
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

  private split(array: any[], subArraySize: number): any[][] {
    let result: any[][] = [];
    for (let i = 0; i < subArraySize; ++i) {
      result[i] = [];
    }
    for (let i = 0; i < array.length; ++i) {
      result[i % subArraySize].push(array[i]);
    }
    return result;
  }

}
