import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {GameOverDialog} from "./pop-ups/game-over/game-over.component";
import {routes} from "./app.routers";
import {RouterModule} from "@angular/router";
import {IntroComponent} from "./intro/intro.component";
import {GameComponent} from "./game/game.component";


@NgModule({
  declarations: [
    AppComponent,
    GameOverDialog,
    IntroComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [GameOverDialog],

})
export class AppModule { }
