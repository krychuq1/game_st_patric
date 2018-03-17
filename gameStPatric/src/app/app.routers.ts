import {Route} from "@angular/router";
import {IntroComponent} from "./intro/intro.component";
import {GameComponent} from "./game/game.component";
import {GameOverComponent} from "./game-over/game-over.component";


export const routes: Route[] = [
    { path: '', component: GameComponent,  pathMatch: 'full' },
   { path: 'koniec', component: GameOverComponent,  pathMatch: 'full' }


];
