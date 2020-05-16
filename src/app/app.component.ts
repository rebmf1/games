import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'games';
  currentUser: User;

  constructor(private userService: UserService) {

  }
  ngOnInit(): void {
    this.userService.subscribeToCurrentUser().subscribe(user => this.updateCurrentUser(user));
  }

  private updateCurrentUser(user: User) {
    this.currentUser = user;
  }

}
