import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player.model';

@Component({
  selector: 'app-initialising-game',
  templateUrl: './initialising-game.component.html',
  styleUrls: ['./initialising-game.component.scss']
})
export class InitialisingGameComponent implements OnInit {

  @Input()
  missingPlayers: number;

  @Input()
  missingNames: number;

  @Input()
  ownerName: string;

  @Input()
  isOwner: boolean

  constructor() { }

  ngOnInit(): void {
  }

}
