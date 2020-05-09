import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../game.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<NewGameComponent>) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: this.formBuilder.control('', Validators.required),
        numberOfTeams: this.formBuilder.control(2, [Validators.required]),
        nameCount: this.formBuilder.control(1, [Validators.required, Validators.pattern('[0-9]+')]),
        roundLength: this.formBuilder.control(30, [Validators.required, Validators.pattern('[0-9]+')])
      });
  }

  newGame() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
