import {Route} from "@angular/router";
import {IntroComponent} from "./intro/intro.component";
import {GameComponent} from "./game/game.component";


export const routes: Route[] = [
    { path: '', component: GameComponent,  pathMatch: 'full' }

];
