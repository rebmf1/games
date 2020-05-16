import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login.guard';
import { AlreadyLoggedInGuard } from './already-logged-in.guard';
import { GamesListComponent } from './games-list/games-list.component';


const routes: Routes = [
  {path: '', redirectTo: 'games', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [AlreadyLoggedInGuard]},
  {path: 'games', component: GamesListComponent, canActivate: [LoginGuard]},
  {path: 'games/:id', component: GameComponent, canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
