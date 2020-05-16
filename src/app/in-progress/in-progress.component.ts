import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Player } from '../player.model';
import { Game } from '../game.model';
import { Name } from '../name.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})
export class InProgressComponent implements OnInit, OnDestroy {

  @Input()
  game: Game;

  @Input()
  me: Player;

  @Input()
  gameId: string;

  @Input()
  currentUserId: string;

  @Input()
  names: Name[];

  @Input()
  players: Player[];

  timeRemaining: number;

  timeChecker: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.timeChecker = interval(1000).subscribe(x => this.calculateTimeRemaining());
  }

  ngOnDestroy() {
    this.timeChecker.unsubscribe();
  }

  calculateTimeRemaining(): void {
    this.timeRemaining = (this.game && this.game.roundEnd)
      ? Math.floor((this.game.roundEnd - Date.now()) / 1000) : null;
  }

  roundInProgress(): boolean {
    return this.timeRemaining > 0 && this.game && !this.game.carryOverTime;
  }

  currentTeamTurn(): string {
    let currentPlayer = this.players ? this.players.filter(p => p.id === this.game.currentUserTurnId)[0] : null;
    return currentPlayer ? currentPlayer.teamName : null;
  }

}
