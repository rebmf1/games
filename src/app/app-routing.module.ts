import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HatGameComponent } from './hat-game/hat-game.component';
import { GameComponent } from './game/game.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login.guard';
import { AlreadyLoggedInGuard } from './already-logged-in.guard';
import { MyGameGuard } from './my-game.guard';


const routes: Routes = [
  {path: '', redirectTo: 'hat-game', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [AlreadyLoggedInGuard]},
  {path: 'hat-game', component: HatGameComponent, canActivate: [LoginGuard]},
  {path: 'hat-game/:id', component: GameComponent, canActivate: [LoginGuard, MyGameGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
