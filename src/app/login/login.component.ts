import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  displayedColumns = ['user', 'select'];
  usersDataSource: MatTableDataSource<User>;
  newUser = false;
  newUserForm: FormGroup;


  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(users => this.usersDataSource = new MatTableDataSource(users));
    this.newUserForm = this.formBuilder.group(
      {
        name: this.formBuilder.control('', [Validators.required])
      });
  }

  addNewUser(): void {
    this.userService.addNewUser(this.newUserForm.value.name).then(x => this.router.navigate(['games']));

  }

  login(user: User): void {
    this.userService.login(user.id);
    this.router.navigate(['games']);
  }

}
