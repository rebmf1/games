import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';
import { UserService } from '../user.service';
import { Player } from '../player.model';

@Component({
  selector: 'app-owner-controls',
  templateUrl: './owner-controls.component.html',
  styleUrls: ['./owner-controls.component.scss']
})
export class OwnerControlsComponent implements OnInit {

  @Input()
  private gameId: string;

  @Input()
  private gameState: string;

  @Input()
  canStart: boolean;

  @Input()
  private players: Player[];

  @Input()
  private numberOfTeams: number;

  constructor(private gameService: GameService, private userService: UserService) { }

  ngOnInit(): void {
  }

  canCancel() {
    return this.gameState !== 'CANCELLED' && this.gameState !== 'COMPLETED';
  }

  cancelGame(): void {
    this.gameService.cancelGame(this.gameId);
    this.userService.removeAllPlayers(this.players);
  }

  startGame(): void {
    this.gameService.startGame(this.gameId, this.players, this.numberOfTeams);
  }


}
