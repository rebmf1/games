import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../game.model';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewGameComponent } from '../new-game/new-game.component';
import { map } from 'rxjs/operators';
import { User } from '../user.model';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {

  gamesDataSource: MatTableDataSource<Game>;
  displayedColumns = ['name', 'owner', 'state', 'join', 'current', 'goto', 'leave'];
  currentUserId: string;
  currentUser: User;

  constructor(private gameService: GameService, private userService: UserService,
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getGames();
    this.currentUserId = this.userService.getCurrentUserId();
    this.userService.getUser(this.currentUserId).subscribe(user => this.currentUser = user);
  }

  addGame(): void {
    this.dialog.open(NewGameComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.gameService.createGame({
            name: result.name,
            numberOfTeams: result.numberOfTeams,
            state: 'INITIALISING',
            namesPerPerson: result.nameCount,
            ownerId: this.currentUserId,
            ownerName: this.currentUser.name,
            currentRound: 1,
            roundLength: result.roundLength
          }).then(
            doc => {
              this.userService.joinGame(doc.id, this.currentUser);
              this.goToGame(doc.id);
            }
          );
        }
      });
  }

  getGames(): void {
    this.gameService.getGames().subscribe(g => this.gamesDataSource = new MatTableDataSource(g));
  }

  joinGame(game: Game): void {
    this.userService.joinGame(game.id, this.currentUser);
    this.goToGame(game.id);
  }

  leaveGame(): void {
    this.userService.leaveGame();
  }

  goToGame(gameId: string): void {
    this.router.navigate([gameId], { relativeTo: this.route });
  }

  getOwner(game: Game): Promise<string> {
    return this.userService.getUser(game.ownerId)
      .pipe(map(user => user.name))
      .toPromise();
  }


}
