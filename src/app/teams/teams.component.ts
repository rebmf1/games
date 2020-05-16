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

  private split(array: any[], count: number): any[][] {

    if (count < 2)
      return [array];

    let len = array.length,
      out = [],
      i = 0,
      size;

    if (len % count === 0) {
      size = Math.floor(len / count);
      while (i < len) {
        out.push(array.slice(i, i += size));
      }
    } else {

      count--;
      size = Math.floor(len / count);
      if (len % size === 0)
        size--;
      while (i < size * count) {
        out.push(array.slice(i, i += size));
      }
      out.push(array.slice(size * count));

    }
    return out;
  }

}
