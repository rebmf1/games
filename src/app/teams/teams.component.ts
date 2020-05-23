import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Player } from '../player.model';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  @Input()
  players: Player[];

  constructor() { }

  ngOnInit(): void {
  }

  teams(): string[] {
    return this.players ? [...new Set(this.players.map(p => p.teamName))] : [];
  }

  score(team: string): number {
    return this.players.filter(p => p.teamName === team)
      .map(p => p.score)
      .reduce((acc, val) => acc += val, 0);
  }

  teamPlayers(team: string): Player[][] {
    return this.split(this.players.filter(p => p.teamName === team), 3);
  }

  private split(array: any[], subArraySize: number): any[][] {
    let result: any[][] = [];
    for (let i = 0; i < array.length; i += subArraySize) {
      result.push(array.slice(i, i + subArraySize));
    }
    return result;
  }

}
