import {AfterViewInit, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import {BeerModel} from "../modals/beer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  title = 'app';
  gn;
  position;
  all;
  character;
  currentPosition;
  maxWidth;
  maxHeight;
  test = 0;
  beerStartPosition = 0;
  beer;
  beers: BeerModel[] = [];
  gameHolder;
  score = 0;
  accelerationX;
  accelerationY;
  accelerationZ;
  ngAfterViewInit(): void {
    console.log('gonna detect move');
    window.ondevicemotion = (event) =>{
          this.position = -1 * (event.accelerationIncludingGravity.x);
          if(this.character){
            //set position to character
            this.setcharacterPostion(this.position);
          }
    };
    //get character
    this.character = document.getElementById('character');
    //set starting margin
    this.character.style.marginLeft = '100px';
    //get game hoolder

    this.gameHolder = document.getElementById('gameHolder');
    this.generateBeers();
    // this.startGame();
  }

  constructor(){
    //set max width minus character with
    this.maxWidth = window.innerWidth - 80;
    this.maxHeight = window.innerHeight - 80;
    this.currentPosition = 100;
  }
  startGame(){
    Observable.interval(42).subscribe(x => {
      //for all beers
      this.beers.forEach((beer)=>{
        beer.positionY = beer.positionY + beer.speed;
        beer.img.style.bottom = beer.positionY + 'px';
        this.checkIfBeerTouched(beer);
        if(beer.positionY > this.maxHeight + 40){
          beer.positionY = this.getRandomInt(-100, 0);

        }
      });

      this.test++;
    });
  }
  checkIfBeerTouched(beer){
    let charStart = this.currentPosition;
    let charEnd = this.currentPosition + 103;
    let maxY = this.maxHeight - 20;
    let minY = this.maxHeight - 100;
    if(beer.positionX >= charStart && beer.positionX  <= charEnd &&
      beer.positionY >= minY &&  beer.positionY <= maxY){
      this.score ++;
      beer.positionY = this.getRandomInt(-100, 0);
      // console.log('GET GET')
    }

  }
  setcharacterPostion(value){
      this.currentPosition = this.currentPosition + 2 * value;
      this.currentPosition = Math.round(this.currentPosition);

    if(this.currentPosition>-20 && this.currentPosition <= this.maxWidth){
      this.character.style.marginLeft = Math.round(this.currentPosition) + 'px';
    }else{
      if(this.currentPosition > this.maxWidth){
        this.currentPosition = this.maxWidth;
      }else {
        this.currentPosition = 0;
      }
    }
  }
   generateBeers(){

     // beerImg.setAttribute('id', 'beer');

     console.log(this.gameHolder, 'this is game holder');
      for(let i = 0; i<10; i++){
        let positionX = this.getRandomInt(0, this.maxWidth);
        let positionY = this.getRandomInt(-100, 0);
        let id = 'beer' + i;
        let speed = this.getRandomInt(1, 8);

        let beerImg = document.createElement('img');
        beerImg.setAttribute('src', '../assets/beer.png');
        beerImg.setAttribute('id', id);
        beerImg.style.left = '0px';
        beerImg.style.position = 'absolute';
        beerImg.style.bottom = positionY +'px';
        beerImg.style.height = '50px';
        beerImg.style.left = positionX + 'px';

        this.beers.push(new BeerModel(positionX, positionY, speed, id, beerImg));
        this.gameHolder.appendChild(beerImg);
      }
      console.log(this.beers);
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
