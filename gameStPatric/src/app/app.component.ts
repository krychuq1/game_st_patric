import {AfterViewInit, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import {BeerModel} from "../modals/beer";
import {GameOverDialog} from "./pop-ups/game-over/game-over.component";
import {MatDialog} from "@angular/material";
import {tick} from "@angular/core/testing";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  position;
  character;
  currentPosition;
  maxWidth;
  maxHeight;
  test = 0;
  beer;
  beers: BeerModel[] = [];
  gameHolder;
  score = 0;
  road: HTMLElement;
  roadStart: number;
  roadEnd: number;
  health: number;
  tick;
  isRunning: boolean;
  ngAfterViewInit(): void {
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
    //set starting y postion
    this.character.style.bottom = this.maxHeight / 2 + 'px';
    //get game hoolder
    this.gameHolder = document.getElementById('gameHolder');
    this.road = document.getElementById('road');

    this.setRoad();
    this.generateBeers(6);
    this.startGame();
  }

  constructor(public dialog: MatDialog){
    //set max width minus character with
    this.maxWidth = window.innerWidth - 80;
    this.maxHeight = window.innerHeight - 80;
    this.currentPosition = 100;
    //init health
    this.health = 100;
    this.isRunning = true;
  }
  startGame(){
    this.tick = Observable.interval(42).subscribe(x => {
      if(this.isRunning){
        this.checkOnRoad();
        //for all beers
        this.beers.forEach((beer)=>{
          beer.positionY = beer.positionY + beer.speed;
          beer.img.style.bottom = beer.positionY + 'px';
          this.checkIfBeerTouched(beer);
          //check if beer reached max height
          if(beer.positionY > this.maxHeight + 80){
            //set random y again
            this.randomizeExistingBeer(beer);
          }
        });
      }
      this.test++;
    });
  }
  checkIfBeerTouched(beer){
    let charStart = this.currentPosition - 10;
    let charEnd = this.currentPosition + 45;
    // let maxY = this.maxHeight/2;
    let maxY = this.maxHeight/2 + 45;
    let minY = this.maxHeight/2 - 20;
    if(beer.positionX >= charStart && beer.positionX  <= charEnd &&
      beer.positionY >= minY &&  beer.positionY <= maxY){
      this.score = this.score + 0.01;
      beer.img.style.visibility = 'hidden';
      this.randomizeExistingBeer(beer)
    }

  }
  setcharacterPostion(value){
      this.currentPosition = this.currentPosition + 2 * value;
      this.currentPosition = Math.round(this.currentPosition);
    if(this.currentPosition >-20 && this.currentPosition <= this.maxWidth){
      this.character.style.marginLeft = Math.round(this.currentPosition) + 'px';
    }else{
      if(this.currentPosition > this.maxWidth){
        this.currentPosition = this.maxWidth;
      }else {
        this.currentPosition = 0;
      }
    }
  }
   generateBeers(quantity){
     for(let i = 0; i<quantity; i++){
        let positionX = this.getRandomInt(this.roadStart, this.roadEnd);
       // let positionX = this.roadStart + 100;

       let positionY = this.getRandomInt(-150, -50);
        let id = 'beer' + i;
        let speed = this.getRandomInt(1, 8);
        // let speed = 10;

       let beerImg = document.createElement('img');
        beerImg.setAttribute('src', '../assets/beer.gif');
        beerImg.setAttribute('id', id);
        beerImg.style.left = '0px';
        beerImg.style.position = 'absolute';
        beerImg.style.bottom = positionY +'px';
        beerImg.style.height = '35px';
        beerImg.style.left = positionX + 'px';
        this.beers.push(new BeerModel(positionX, positionY, speed, id, beerImg));
        this.gameHolder.appendChild(beerImg);
      }
  }
  randomizeExistingBeer(beer){
    beer.positionY = this.getRandomInt(-150, -50);
    beer.positionX = this.getRandomInt(this.roadStart, this.roadEnd);
    beer.img.style.left =  beer.positionX + 'px';
    setTimeout(function () {
      beer.img.style.visibility = 'visible';
    },100);

  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  setRoad(){
    let originalRoadWidth = this.maxWidth * 0.95;
    let roadWidth =  Math.round(originalRoadWidth -originalRoadWidth *0.26);
    console.log(roadWidth, 'road with on elf position');

    let margin = (originalRoadWidth - roadWidth) / 2;
    this.roadStart = margin + 40;
    this.roadEnd = roadWidth;
    this.road.style.width = this.maxWidth * 0.95 + 'px';

  }
  checkOnRoad(){
    if(this.health <= 0){
      if(this.isRunning){
        this.gameOver();
      }
    }
    if(this.currentPosition >= (this.roadStart-15) && this.currentPosition <= (this.roadEnd+15)){
    }else{
      this.health = this.health - 0.40;
    }
  }
  gameOver(){
    this.isRunning = !this.isRunning;
    // this.tick.unsubscribe();
    this.dialog.open(GameOverDialog, {
      width: 'auto',
      minWidth: '300px',
    });
  }

}
