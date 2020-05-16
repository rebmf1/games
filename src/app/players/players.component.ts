import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent {

  displayedColumns = ['user', 'namesSubmitted', 'ready'];

  @Input()
  playersDataSource: MatTableDataSource<Player>;

  @Input()
  namesPerPlayer: number;

  @Input()
  missingPlayers: number;
  

  constructor() { }


}
