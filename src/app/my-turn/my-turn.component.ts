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
  passedName: Name;
  canPass: boolean;
  private namesThisRound: Name[];

  constructor(private gameService: GameService, private userService: UserService) { }

  ngOnInit(): void {
    this.gameService.namesThisRound(this.gameId).subscribe(n => this.namesThisRound = n);
  }

  guessName() {
    this.gameService.updateScore(this.gameId, this.currentUserId, this.currentPlayer.score + 1);
    this.gameService.markNameGuessed(this.gameId, this.currentName).then(x =>
      this.getNextName());
  }

  private getNextName(): void {
    if (this.names && this.namesThisRound) {
      let namesRemaining = this.names.filter(name => !this.namesThisRound.map(n => n.id).includes(name.id))
        .filter(name => !this.passedName || this.passedName.id !== name.id);
      this.canPass = (namesRemaining.length > 1) && !this.passedName;
      if (namesRemaining.length > 0) {
        this.currentName = namesRemaining.reduce((prev, current) => prev.sequence < current.sequence ? prev : current);
      } else if (!this.passedName) {
        this.currentName = null;
        if (this.game.currentRound < 3) {
          this.gameService.setCarryOverTime(this.gameId, this.timeRemaining);
        } else {
          this.gameService.updateGameState(this.gameId, 'COMPLETED');
          this.userService.removeAllPlayers(this.players);
        }
      } else {
        this.currentName = this.passedName;
        this.passedName = null;
        this.canPass = false;
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
    this.gameService.nextPlayer(this.gameId, this.currentPlayer.sequence + 1);
    this.gameService.updatePlayerSequence(this.gameId, this.currentUserId, this.currentPlayer.sequence + this.players.length);
  }

  passName() {
    this.passedName = this.currentName;
    this.canPass = false;
    this.getNextName();
  }

  guessPassedName() {
    this.gameService.updateScore(this.gameId, this.currentUserId, this.currentPlayer.score + 1);
    this.gameService.markNameGuessed(this.gameId, this.passedName);
    this.passedName = null;
  }

}
