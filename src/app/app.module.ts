import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NewGameComponent } from './new-game/new-game.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { GamesListComponent } from './games-list/games-list.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { TeamsComponent } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';
import { AddNameComponent } from './add-name/add-name.component';
import { OwnerControlsComponent } from './owner-controls/owner-controls.component';
import { PlayerControlsComponent } from './player-controls/player-controls.component';
import { InitialisingGameComponent } from './initialising-game/initialising-game.component';
import { InProgressComponent } from './in-progress/in-progress.component';
import { MyTurnComponent } from './my-turn/my-turn.component';
import { CompleteComponent } from './complete/complete.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    GameComponent,
    LoginComponent,
    GamesListComponent,
    GameInfoComponent,
    TeamsComponent,
    PlayersComponent,
    AddNameComponent,
    OwnerControlsComponent,
    PlayerControlsComponent,
    InitialisingGameComponent,
    InProgressComponent,
    MyTurnComponent,
    CompleteComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
