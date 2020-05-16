import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../player.model';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  @Input()
  players: Player[];

  constructor() { }

  ngOnInit(): void {
  }

  winningTeams(): string[] {
    let maxScore = 0;
    let winningTeams: string[] = [];
    this.teams().forEach(team => {
      let score = this.score(team);
      if (score > maxScore) {
        maxScore = score;
        winningTeams = [team];
      } else if (score === maxScore) {
        winningTeams.push(team);
      }
    });
    return winningTeams;
  }

  private teams(): string[] {
    return this.players ? [...new Set(this.players.map(p => p.teamName))] : [];
  }

  private score(team: string): number {
    return this.players.filter(p => p.teamName === team)
      .map(p => p.score)
      .reduce((acc, val) => acc += val, 0);
  }
}
