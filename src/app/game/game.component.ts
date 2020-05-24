import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Name } from '../name.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { Subscription, interval } from 'rxjs';
import { Player } from '../player.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  
  gameId: string;
  game: Game;
  playersDataSource: MatTableDataSource<Player>;
  players: Player[];
  names: Name[];
  currentUser: User;
  
  currentUserId: string;
  
  currentName: Name;
  currentPlayer: Player;

  constructor(private gameService: GameService, private route: ActivatedRoute, private userService: UserService,
    private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
    this.userService.getUser(this.currentUserId).subscribe(user => this.currentUser = user);
    this.route.params.subscribe(params => {
      this.gameId = params['id'];
      this.gameService.getGame(this.gameId).subscribe(g => this.game = g);
      this.gameService.getPlayers(this.gameId).subscribe(players => {
        this.players = players;
        this.playersDataSource = new MatTableDataSource(players);
      });
      this.gameService.names(this.gameId).subscribe(n => this.names = n);
      this.gameService.getPlayer(this.gameId, this.currentUserId).subscribe(player => this.currentPlayer = player);
    });
    
  }

  canStart(): boolean {
    return this.readyToStart()
      && this.game.ownerId === this.currentUserId
  }

  readyToStart(): boolean {
    return this.game
      && this.playersDataSource
      && this.names
      && this.missingNames() <= 0
      && this.game.state === 'INITIALISING'
      && this.missingPlayers() <= 0;
  }

  missingNames(): number {
    return this.totalNamesNeeded() - this.names.length;
  }

  missingPlayers(): number {
    return (!this.game || !this.playersDataSource) ? 0 :
      (this.game.numberOfTeams * 2) - this.playersDataSource.data.length;
  }

  totalNamesNeeded(): number {
    return (!this.game || !this.playersDataSource) ? 0 :
      this.playersDataSource.data.length * this.game.namesPerPerson;
  }

  isMobile(): boolean {
    return this.deviceService.isMobile();
  }

}
