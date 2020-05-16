import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../game.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent {

  @Input()
  game: Game;

  constructor() { }
}
