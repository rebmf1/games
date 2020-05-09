import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../game.model';
import { GameService } from '../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { Name } from '../name.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from '../team.model';
import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  playersDisplayedColumns = ['user', 'namesSubmitted', 'score', 'team'];
  teamsDisplayedColumns = ['name', 'score'];
  gameId: string;
  game: Game;
  playersDataSource: MatTableDataSource<User>;
  teamsDataSource: MatTableDataSource<Team>;
  names: Name[];
  currentUser: User;
  addName: FormGroup;
  currentUserId: string;
  namesThisRound: Name[];
  timeChecker: Subscription;
  timeRemaining: number;
  currentName: Name;
  carryOverTime: number;

  constructor(private gameService: GameService, private route: ActivatedRoute, private userService: UserService,
    private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameId = params['id'];
      this.gameService.getGame(this.gameId).subscribe(g => this.game = g);
      this.gameService.getPlayers(this.gameId).subscribe(players => this.playersDataSource = new MatTableDataSource(players));
      this.gameService.names(this.gameId).subscribe(n => this.names = n);
      this.gameService.namesThisRound(this.gameId).subscribe(n => this.namesThisRound = n);
      this.gameService.teams(this.gameId).subscribe(teams => this.teamsDataSource = new MatTableDataSource(teams));
    });
    this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    this.addName = this.formBuilder.group(
      {
        name: this.formBuilder.control('', Validators.required)
      }
    );
    this.currentUserId = this.userService.getCurrentUserId();
    this.timeChecker = interval(1000).subscribe(x => this.calculateTimeRemaining());
    this.getNextName();
  }

  ngOnDestroy() {
    this.timeChecker.unsubscribe();
  }

  saveName() {
    if (this.addName.valid) {
      this.gameService.addName(this.gameId, this.addName.value.name);
      this.userService.incrementNameCount();
    }
  }

  leaveGame(): void {
    this.userService.leaveGame();
    this.router.navigate(['/hat-game'])
  }

  cancelGame(): void {
    this.gameService.cancelGame(this.gameId);
  }

  startGame(): void {
    this.gameService.startGame(this.gameId);
  }

  canLeave(): boolean {
    return this.game
      && this.game.state == 'INITIALISING'
      && this.game.ownerId !== this.currentUserId;
  }

  canCancel(): boolean {
    return this.game
      && this.game.state !== 'CANCELLED'
      && this.game.ownerId === this.currentUserId;
  }

  canStart(): boolean {
    return this.readyToStart()
      && this.game.ownerId === this.currentUserId
  }

  readyToStart(): boolean {
    return this.game
      && this.playersDataSource
      && this.names
      && this.totalNamesNeeded() <= this.names.length
      && this.game.state === 'INITIALISING'
      && this.missingPlayers() <= 0;
  }

  missingPlayers(): number {
    return (!this.game || !this.playersDataSource) ? 0 :
      (this.game.numberOfTeams * 2) - this.playersDataSource.data.length;
  }

  totalNamesNeeded(): number {
    return (!this.game || !this.playersDataSource) ? 0 :
      this.playersDataSource.data.length * this.game.namesPerPerson;
  }

  calculateTimeRemaining(): void {
    this.timeRemaining = (this.game && this.game.roundEnd)
      ? Math.floor((this.game.roundEnd - Date.now()) / 1000) : null;
  }

  private getNextName(): void {
    if (this.names && this.namesThisRound) {
      let namesRemaining = this.names.filter(name => !this.namesThisRound.map(n => n.id).includes(name.id));
      if (namesRemaining.length > 0) {
        this.currentName = namesRemaining.reduce((prev, current) => prev.sequence < current.sequence ? prev : current);
        this.carryOverTime = null;
      } else {
        this.currentName = null;
        this.carryOverTime = this.timeRemaining;
      }
    }
  }

  startRound(): void {
    this.gameService.startRound(this.gameId, this.carryOverTime ? this.carryOverTime : this.game.roundLength);
    this.getNextName();
  }

  roundInProgress(): boolean {
    return this.timeRemaining > 0 && !this.carryOverTime;
  }

  nextName() {
    this.userService.incrementScore();
    this.gameService.markNameGuessed(this.gameId, this.currentName).then(x =>
      this.getNextName());
  }

  nextPlayer() {
    this.gameService.nextPlayer(this.gameId, this.currentUser.sequence);
  }

  nextRound() {
    this.gameService.nextRound(this.gameId, this.game.currentRound);
    this.timeRemaining = null;
  }

  winningTeam(): Team {
    return this.teamsDataSource ?
      this.teamsDataSource.data.reduce((prev, current) => prev.score > current.score ? prev : current)
      : null
  }
}
