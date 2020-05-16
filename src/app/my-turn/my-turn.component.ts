import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { Player } from '../player.model';
import { Name } from '../name.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-my-turn',
  templateUrl: './my-turn.component.html',
  styleUrls: ['./my-turn.component.scss']
})
export class MyTurnComponent implements OnInit {

  @Input()
  game: Game;

  @Input()
  private gameId: string;

  @Input()
  private currentUserId: string;

  @Input()
  currentPlayer: Player;

  @Input()
  private players: Player[];

  @Input()
  private names: Name[];

  @Input()
  timeRemaining: number;

  @Input()
  roundInProgress: boolean;

  currentName: Name;
  private namesThisRound: Name[];

  constructor(private gameService: GameService, private userService: UserService) { }

  ngOnInit(): void {
    this.gameService.namesThisRound(this.gameId).subscribe(n => this.namesThisRound = n);
  }

  nextName() {
    this.gameService.updateScore(this.gameId, this.currentUserId, this.currentPlayer.score + 1);
    this.gameService.markNameGuessed(this.gameId, this.currentName).then(x =>
      this.getNextName());
  }

  private getNextName(): void {
    if (this.names && this.namesThisRound) {
      let namesRemaining = this.names.filter(name => !this.namesThisRound.map(n => n.id).includes(name.id));
      if (namesRemaining.length > 0) {
        this.currentName = namesRemaining.reduce((prev, current) => prev.sequence < current.sequence ? prev : current);
      } else {
        this.currentName = null;
        if (this.game.currentRound < 3) {
          this.gameService.setCarryOverTime(this.gameId, this.timeRemaining);
        } else {
          console.log('complete');
          this.gameService.updateGameState(this.gameId, 'COMPLETED');
          console.log('marked game complete');
          this.userService.removeAllPlayers(this.players);
          console.log('removed players');
        }
      }
    }
  }

  startRound(): void {
    this.getNextName();
    this.gameService.startRound(this.gameId, this.game.carryOverTime ? this.game.carryOverTime : this.game.roundLength);
  }

  nextRound() {
    this.gameService.nextRound(this.gameId, this.game.currentRound);
    this.timeRemaining = null;
  }

  nextPlayer() {
    this.gameService.nextPlayer(this.gameId,
      (this.currentPlayer.sequence < this.players.length) ? (this.currentPlayer.sequence + 1) : 1);
  }


}
