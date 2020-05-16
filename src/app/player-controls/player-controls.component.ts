import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.scss']
})
export class PlayerControlsComponent implements OnInit {

  @Input()
  private gameState: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  canLeave(): boolean {
    return this.gameState == 'INITIALISING';
  }


  leaveGame(): void {
    this.userService.leaveGame();
    this.router.navigate(['/games'])
  }

}
