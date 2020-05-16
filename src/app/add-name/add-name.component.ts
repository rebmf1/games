import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GameService } from '../game.service';

@Component({
  selector: 'app-add-name',
  templateUrl: './add-name.component.html',
  styleUrls: ['./add-name.component.scss']
})
export class AddNameComponent implements OnInit {

  @Input()
  private gameId: string;

  @Input()
  private currentUserId: string;

  @Input()
  private namesSubmitted: number;

  @Input() 
  missingNames: number;

  addName: FormGroup;

  constructor(private formBuilder: FormBuilder, private gameService: GameService) { }

  ngOnInit(): void {
    this.addName = this.formBuilder.group(
      {
        name: this.formBuilder.control('', Validators.required)
      }
    ); 
  }

  saveName() {
    if (this.addName.valid) {
      this.gameService.addName(this.gameId, this.addName.value.name);
      this.gameService.updateNamesSubmittedCount(this.gameId, this.currentUserId, this.namesSubmitted + 1);
      this.addName.setValue({name: ''});
    }
  }

}
